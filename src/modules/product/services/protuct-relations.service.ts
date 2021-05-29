import { forwardRef, Inject, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { CrudRequest, GetManyDefaultResponse } from '@nestjsx/crud'
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm'
import { Repository } from 'typeorm'

import { ProductEntity } from '../entities/product.entity'
import { EntityNotFoundException } from 'src/exceptions/not-found/entity-not-found.exception'
import { CategoryEntity } from 'src/modules/category/entities/category.entity'
import { RatingEntity } from 'src/modules/rating/entities/rating.entity'

import { ProductReviewDto } from '../models/product-review.dto'

import { CategoryService } from 'src/modules/category/services/category.service'
import { RatingService } from 'src/modules/rating/services/rating.service'

/**
 * The app's main product relation service class
 *
 * Class that deals with the product relation data
 */
@Injectable()
export class ProductRelationsService extends TypeOrmCrudService<ProductEntity> {
  public constructor(
    @InjectRepository(ProductEntity)
    repository: Repository<ProductEntity>,
    @Inject(forwardRef(() => CategoryService))
    private readonly categoryService: CategoryService,
    @Inject(forwardRef(() => RatingService))
    private readonly ratingService: RatingService
  ) {
    super(repository)
  }

  /**
   * Method that can get all the categories of some product
   *
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
   *
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
   * Method that can get a review of the product ratings
   *
   * @param productId stores the product id
   * @returns the product review
   */
  public async getReviewByProductId(
    productId: number
  ): Promise<ProductReviewDto> {
    return await this.ratingService.getReviewByProductId(productId)
  }
}
