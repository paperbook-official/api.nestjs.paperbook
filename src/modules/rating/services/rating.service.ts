import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { CrudRequest } from '@nestjsx/crud'
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm'
import { Repository } from 'typeorm'

import { RatingEntity } from '../entities/rating.entity'
import { EntityNotFoundException } from 'src/exceptions/not-found/entity-not-found.exception'

import { CreateRatingPayload } from '../models/create-rating.payload'
import { UpdateRatingPayload } from '../models/update-rating.payload'

import { ProductService } from 'src/modules/product/services/product.service'

/**
 * The app's main rating service class
 *
 * Class that deals with the ratings data
 */
@Injectable()
export class RatingService extends TypeOrmCrudService<RatingEntity> {
  public constructor(
    @InjectRepository(RatingEntity)
    private readonly repository: Repository<RatingEntity>,
    private readonly productService: ProductService
  ) {
    super(repository)
  }

  /**
   * Method that can create a new rating entity
   * @param createRatingPayload stores the new rating data
   * @returns the created rating entity
   */
  public async create(
    createRatingPayload: CreateRatingPayload
  ): Promise<RatingEntity> {
    const { productId } = createRatingPayload

    // if there is no product the get method will throw an exception
    const product = await this.productService.get(productId)

    return await new RatingEntity({
      ...createRatingPayload,
      productId,
      product
    }).save()
  }

  /**
   * Method that can only one rating entity
   * @param ratingId stores the rating id
   * @param crudRequest stores the joins, filters, etc
   * @returns the found rating entity
   */
  public async get(
    ratingId: number,
    crudRequest?: CrudRequest
  ): Promise<RatingEntity> {
    let entity: RatingEntity

    if (crudRequest) {
      entity = await super.getOne(crudRequest).catch(() => undefined)
    } else {
      entity = await RatingEntity.findOne({ id: ratingId })
    }

    if (!entity || !entity.isActive) {
      throw new EntityNotFoundException(ratingId)
    }

    return entity
  }

  /**
   * Method that can change some entity data
   * @param ratingId stores the rating entity id
   * @param updateRatingPayload stores the rating entity new data
   */
  public async update(
    ratingId: number,
    updateRatingPayload: UpdateRatingPayload
  ): Promise<void> {
    const entity = await RatingEntity.findOne({ id: ratingId })

    if (!entity || !entity.isActive) {
      throw new EntityNotFoundException(ratingId, RatingEntity)
    }

    await RatingEntity.update({ id: ratingId }, updateRatingPayload)
  }
}
