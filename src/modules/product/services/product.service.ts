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
import { CategoryEntity } from 'src/modules/category/entities/category.entity'
import { RatingEntity } from 'src/modules/rating/entities/rating.entity'
import { UserEntity } from 'src/modules/user/entities/user.entity'

import { CreateProductDto } from '../models/create-product.dto'
import { ProductReviewDto } from '../models/product-review.dto'
import { UpdateProductDto } from '../models/update-product.dto'

import { CategoryService } from 'src/modules/category/services/category.service'
import { RatingService } from 'src/modules/rating/services/rating.service'
import { UserService } from 'src/modules/user/services/user.service'

import { ForbiddenException } from 'src/exceptions/forbidden/forbidden.exception'
import { SortBySearchEnum } from 'src/models/enums/sort-by-search.enum'

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
    private readonly userService: UserService,
    @Inject(forwardRef(() => CategoryService))
    private readonly categoryService: CategoryService,
    @Inject(forwardRef(() => RatingService))
    private readonly ratingService: RatingService
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
    requestUser: UserEntity,
    createProductPayload: CreateProductDto
  ): Promise<ProductEntity> {
    // If the user not exists the service will throw an exception

    const user = await this.userService.get(
      createProductPayload.userId,
      requestUser
    )

    const { categoryIds, ...rest } = createProductPayload

    const categories: CategoryEntity[] = []

    if (categoryIds) {
      for (const id of categoryIds) {
        const category = await this.categoryService.get(id)
        categories.push(category)
      }
    }

    return await new ProductEntity({
      ...rest,
      categories,
      user
    }).save()
  }

  /**
   * Method that can get a review of the product ratings
   * @param productId stores the product id
   * @returns the product review
   */
  public async getReviewByProductId(
    productId: number
  ): Promise<ProductReviewDto> {
    return await this.ratingService.getReviewByProductId(productId)
  }

  /**
   * Method that can get only product entity from the
   * @param productId stores the product id
   * @param crudRequest stores the joins, filter, etc
   * @throws {EntityNotFoundException} if the product was not found
   * @returns the found product entity
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
      throw new EntityNotFoundException(productId, ProductEntity)
    }

    return entity
  }

  /**
   * Method that can products with price less than the current price with
   * discount
   * @param maxPrice stores the max price
   * @param crudRequest stores the joins, filter, etc
   * @returns all the found products
   */
  public async getLessThan(
    maxPrice: number,
    crudRequest?: CrudRequest
  ): Promise<GetManyDefaultResponse<ProductEntity> | ProductEntity[]> {
    const { parsed, options } = crudRequest
    const builder = await this.createBuilder(parsed, options)

    return await this.doGetMany(
      builder.andWhere(`price * (1 - discount) <= ${maxPrice}`),
      parsed,
      options
    )
  }

  /**
   * Method that searches products based on the query values
   * @param name stores the product name
   * @param categoryId stores the category id
   * @param minPrice stores the product min price
   * @param maxPrice stores the product max price
   * @param state stores the seller state
   * @param freeOfInterests stores a value indicating if the products
   * are free or interests
   * @param crudRequest stores the joins, filters, etc;
   * @returns all the found products that match with the queries
   */
  public async search(
    name?: string,
    categoryId?: number,
    minPrice?: number,
    maxPrice?: number,
    state?: string,
    freeOfInterests?: boolean,
    sortBy?: SortBySearchEnum,
    crudRequest?: CrudRequest
  ): Promise<GetManyDefaultResponse<ProductEntity> | ProductEntity[]> {
    const { parsed, options } = crudRequest

    crudRequest.parsed.paramsFilter = []
    crudRequest.parsed.join = [
      ...crudRequest.parsed.join,
      { field: 'categories', select: ['id'] },
      { field: 'user' },
      { field: 'user.addresses', select: ['state'] }
    ]

    if (categoryId !== undefined) {
      crudRequest.parsed.search.$and.push({
        'categories.id': {
          $eq: categoryId
        }
      })
    }

    if (name !== undefined) {
      crudRequest.parsed.search.$and.push({
        name: {
          $contL: name
        }
      })
    }

    if (freeOfInterests !== undefined) {
      if (freeOfInterests) {
        crudRequest.parsed.search.$and.push({
          installmentPrice: {
            $isnull: true
          }
        })
      } else {
        crudRequest.parsed.search.$and.push({
          installmentPrice: {
            $ne: 0
          }
        })
      }
    }

    if (state !== undefined) {
      crudRequest.parsed.search.$and.push({
        'user.addresses.street': {
          $contL: state
        }
      })
    }

    let builder = await this.createBuilder(parsed, options)

    if (maxPrice !== undefined)
      builder = builder
        .addSelect(['price', 'discount'])
        .andWhere(`price * (1 - discount) <= ${maxPrice}`)
    if (minPrice !== undefined)
      builder = builder
        .addSelect(['price', 'discount'])
        .andWhere(`price * (1 - discount) > ${minPrice}`)

    if (sortBy === 'minPrice')
      builder = builder
        .addSelect(['price', 'discount'])
        .addOrderBy('price * (1 - discount)', 'ASC')
    else if (sortBy === 'maxPrice')
      builder = builder
        .addSelect(['price', 'discount'])
        .addOrderBy('price * (1 - discount)', 'DESC')

    return await this.doGetMany(builder, parsed, options)
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
        discount: {
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
          $or: {
            $isnull: true
          }
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
   * Method that can get all the categories of some product
   * @param productId stores the product id
   * @param crudRequest stores the joins, filters, etc
   * @returns all the found categories
   */
  public async getCategoriesByProductId(
    productId: number,
    crudRequest?: CrudRequest
  ): Promise<GetManyDefaultResponse<CategoryEntity> | CategoryEntity[]> {
    const entity = await ProductEntity.findOne({ id: productId })

    if (!entity || !entity.isActive) {
      throw new EntityNotFoundException(productId, ProductEntity)
    }

    crudRequest.parsed.paramsFilter = []
    crudRequest.parsed.join = [
      ...crudRequest.parsed.join,
      {
        field: 'products',
        select: ['id']
      }
    ]
    crudRequest.parsed.search.$and = [
      ...crudRequest.parsed.search.$and,
      {
        'products.id': { $eq: productId }
      }
    ]

    return await this.categoryService.getMany(crudRequest)
  }

  /**
   * Method that can get the ratings of some product
   * @param productId stores the product id
   * @param crudRequest stores the joins, filters, etc
   * @returns all the found rating entities
   */
  public async getRatingsByProductId(
    productId: number,
    crudRequest?: CrudRequest
  ): Promise<GetManyDefaultResponse<RatingEntity> | RatingEntity[]> {
    const entity = await ProductEntity.findOne({ id: productId })

    if (!entity || !entity.isActive) {
      throw new EntityNotFoundException(productId, ProductEntity)
    }

    crudRequest.parsed.search = {
      $and: [
        ...crudRequest.parsed.search.$and,
        {
          productId: {
            $eq: productId
          }
        }
      ]
    }

    return await this.ratingService.getMany(crudRequest)
  }

  /**
   * Method that can change the data of some product
   * @param productId stores the product id
   * @param requestUser stores the logged user data
   * @param updateProductPayload stores the product new data
   */
  public async update(
    productId: number,
    requestUser: UserEntity,
    updateProductPayload: UpdateProductDto
  ): Promise<void> {
    const entity = await ProductEntity.findOne({ id: productId })

    if (!entity || !entity.isActive) {
      throw new EntityNotFoundException(productId, ProductEntity)
    }

    if (!this.userService.hasPermissions(entity.userId, requestUser)) {
      throw new ForbiddenException()
    }

    const { categoryIds, ...rest } = updateProductPayload

    const categories: CategoryEntity[] = []

    for (const id of categoryIds) {
      const category = await this.categoryService.get(id)
      categories.push(category)
    }

    await this.repository.save({ ...entity, ...rest, categories })
  }

  /**
   * Method that can remove some product from the database
   * @param productId stores the product id
   * @param requestUser stores the logged user data
   */
  public async delete(
    productId: number,
    requestUser: UserEntity
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
    requestUser: UserEntity
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
    requestUser: UserEntity
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
