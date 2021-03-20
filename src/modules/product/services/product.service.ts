import {
  ConflictException,
  ForbiddenException,
  forwardRef,
  Injectable,
  NotFoundException
} from '@nestjs/common'
import { Inject } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm'
import { Repository } from 'typeorm'

import { ProductEntity } from '../entities/product.entity'

import { CreateProductPaylaod } from '../models/create-product.payload'
import { UpdateProductPayload } from '../models/update-product.payload'

import { UserService } from 'src/modules/user/services/user.service'

import { RequestUser } from 'src/utils/type.shared'

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
   * @throws {NotFoundException} if the user was not found
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
      throw new NotFoundException(
        `The entity identified by "${productId}" does not exist or is disabled`
      )
    }

    if (!this.userService.hasPermissions(entity.userId, requestUser)) {
      throw new ForbiddenException(
        'You have no permission to access those sources'
      )
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
      throw new NotFoundException(
        `The entity identified by "${productId}" does not exist or is disabled`
      )
    }

    if (!this.userService.hasPermissions(entity.userId, requestUser)) {
      throw new ForbiddenException(
        'You have no permission to access those sources'
      )
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
      throw new NotFoundException(
        `The entity identified by "${productId}" does not exist or is disabled`
      )
    }

    if (!entity.isActive) {
      throw new ConflictException(
        `The entity identified by "${productId}" is already disabled`
      )
    }

    if (!this.userService.hasPermissions(entity.userId, requestUser)) {
      throw new ForbiddenException(
        'You have no permission to access those sources'
      )
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
      throw new NotFoundException(
        `The entity identified by "${productId}" does not exist or is disabled`
      )
    }

    if (entity.isActive) {
      throw new ConflictException(
        `The entity identified by "${productId}" is already enabled`
      )
    }

    if (!this.userService.hasPermissions(entity.userId, requestUser)) {
      throw new ForbiddenException(
        'You have no permission to access those sources'
      )
    }

    await ProductEntity.update({ id: productId }, { isActive: true })
  }
}
