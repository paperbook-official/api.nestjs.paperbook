import { forwardRef, Injectable } from '@nestjs/common'
import { Inject } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { CrudRequest, GetManyDefaultResponse } from '@nestjsx/crud'
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm'
import { Repository } from 'typeorm'

import { ProductEntity } from '../entities/product.entity'
import { EntityAlreadyDisabledException } from 'src/exceptions/conflict/entity-already-disabled.exception'
import { EntityAlreadyEnabledException } from 'src/exceptions/conflict/entity-already-enabled.exception'
import { EntityNotFoundException } from 'src/exceptions/not-found/entity-not-found.exception'

import { CreateProductPaylaod } from '../models/create-product.payload'
import { UpdateProductPayload } from '../models/update-product.payload'

import { UserService } from 'src/modules/user/services/user.service'

import { RequestUser } from 'src/utils/type.shared'

import { ForbiddenException } from 'src/exceptions/forbidden/forbidden.exception'

/**
 * The app's main product service class
 *
 * Class that deals with the products data
 */
@Injectable()
export class ProductService extends TypeOrmCrudService<ProductEntity> {
  public constructor(
    @InjectRepository(ProductEntity)
    private readonly repository: Repository<ProductEntity>,
    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService
  ) {
    super(repository)
  }

  /**
   * Method that can save some entity in the database
   * @param requestUser stores the logged user data
   * @param createProductPayload stores the new product data
   * @throws {EntityNotFoundException} if the user was not found
   * @throws {ForbiddenException} if the request user has no permissions
   * to execute this action
   * @returns the created product
   */
  public async create(
    requestUser: RequestUser,
    createProductPayload: CreateProductPaylaod
  ): Promise<ProductEntity> {
    const user = await this.userService.get(
      createProductPayload.userId,
      requestUser
    )
    return await new ProductEntity({
      ...createProductPayload,
      user
    }).save()
  }

  /**
   * Method that can get only product entity from the database
   * @param productId stores the product id
   * @param crudRequest stores the joins, filter, etc
   * @throws {EntityNotFoundException} if the product was not found
   * @returns the found entity
   */
  public async get(
    productId: number,
    crudRequest?: CrudRequest
  ): Promise<ProductEntity> {
    let entity: ProductEntity

    if (crudRequest) {
      entity = await super.getOne(crudRequest).catch(() => undefined)
    } else {
      entity = await ProductEntity.findOne({ id: productId })
    }

    if (!entity || !entity.isActive) {
      throw new EntityNotFoundException(productId)
    }

    return entity
  }

  public async getLessThan(
    maxPrice: number,
    crudRequest?: CrudRequest
  ): Promise<GetManyDefaultResponse<ProductEntity> | ProductEntity[]> {
    const { parsed, options } = crudRequest
    const builder = await this.createBuilder(parsed, options)

    const entities = await this.doGetMany(
      builder.andWhere(`fullPrice * (1 - discountAmount) <= ${maxPrice}`),
      parsed,
      options
    )
    return entities
  }

  /**
   * Method that can get some offers
   * @param crudRequest stores the joins, filter, etc
   * @returns all the found products
   */
  public async getOnSale(
    crudRequest?: CrudRequest
  ): Promise<GetManyDefaultResponse<ProductEntity> | ProductEntity[]> {
    crudRequest.parsed.search.$and = [
      ...crudRequest.parsed.search.$and,
      {
        discountAmount: {
          $gt: 0
        }
      }
    ]
    return this.getMany(crudRequest)
  }

  /**
   * Method that can get some free of interests products
   * @param crudRequest stores the joins, filers, etc
   * @returns all the found products
   */
  public async getFreeOfInterests(
    crudRequest?: CrudRequest
  ): Promise<GetManyDefaultResponse<ProductEntity> | ProductEntity[]> {
    crudRequest.parsed.search.$and = [
      ...crudRequest.parsed.search.$and,
      {
        installmentPrice: {
          $isnull: true
        }
      }
    ]
    return this.getMany(crudRequest)
  }

  /**
   * Method that can get some products added recently
   * @param crudRequest stores the joins, filters, etc.
   * @returns all the found elements
   */
  public async getRecents(
    crudRequest?: CrudRequest
  ): Promise<GetManyDefaultResponse<ProductEntity> | ProductEntity[]> {
    crudRequest.parsed.sort = [
      {
        field: 'createdAt',
        order: 'ASC'
      }
    ]
    return this.getMany(crudRequest)
  }

  /**
   * Method that can change the data of some product
   * @param productId stores the product id
   * @param requestUser stores the logged user data
   * @param updateProductPayload stores the product new data
   */
  public async update(
    productId: number,
    requestUser: RequestUser,
    updateProductPayload: UpdateProductPayload
  ): Promise<void> {
    const entity = await ProductEntity.findOne({ id: productId })

    if (!entity || !entity.isActive) {
      throw new EntityNotFoundException(productId, ProductEntity)
    }

    if (!this.userService.hasPermissions(entity.userId, requestUser)) {
      throw new ForbiddenException()
    }

    await ProductEntity.update({ id: productId }, updateProductPayload)
  }

  /**
   * Method that can remove some product from the database
   * @param productId stores the product id
   * @param requestUser stores the logged user data
   */
  public async delete(
    productId: number,
    requestUser: RequestUser
  ): Promise<void> {
    const entity = await ProductEntity.findOne({ id: productId })

    if (!entity || !entity.isActive) {
      throw new EntityNotFoundException(productId, ProductEntity)
    }

    if (!this.userService.hasPermissions(entity.userId, requestUser)) {
      throw new ForbiddenException()
    }

    await ProductEntity.delete({ id: productId })
  }

  /**
   * Method that can disables some product
   * @param productId stores the product id
   * @param requestUser stores the logged user data
   */
  public async disable(
    productId: number,
    requestUser: RequestUser
  ): Promise<void> {
    const entity = await ProductEntity.findOne({ id: productId })

    if (!entity) {
      throw new EntityNotFoundException(productId, ProductEntity)
    }

    if (!entity.isActive) {
      throw new EntityAlreadyDisabledException(productId, ProductEntity)
    }

    if (!this.userService.hasPermissions(entity.userId, requestUser)) {
      throw new ForbiddenException()
    }

    await ProductEntity.update({ id: productId }, { isActive: false })
  }

  /**
   * Method that can enables some product
   * @param productId stores the product id
   * @param requestUser stores the logged user data
   */
  public async enable(
    productId: number,
    requestUser: RequestUser
  ): Promise<void> {
    const entity = await ProductEntity.findOne({ id: productId })

    if (!entity) {
      throw new EntityNotFoundException(productId, ProductEntity)
    }

    if (entity.isActive) {
      throw new EntityAlreadyEnabledException(productId, ProductEntity)
    }

    if (!this.userService.hasPermissions(entity.userId, requestUser)) {
      throw new ForbiddenException()
    }

    await ProductEntity.update({ id: productId }, { isActive: true })
  }
}
