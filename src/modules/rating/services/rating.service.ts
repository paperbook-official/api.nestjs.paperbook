import { forwardRef, Inject, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { CrudRequest } from '@nestjsx/crud'
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm'
import { Repository } from 'typeorm'

import { RatingEntity } from '../entities/rating.entity'
import { EntityAlreadyDisabledException } from 'src/exceptions/conflict/entity-already-disabled.exception'
import { EntityAlreadyEnabledException } from 'src/exceptions/conflict/entity-already-enabled.exception'
import { EntityNotFoundException } from 'src/exceptions/not-found/entity-not-found.exception'
import { UserEntity } from 'src/modules/user/entities/user.entity'

import { CreateRatingDto } from '../models/create-rating.dto'
import { UpdateRatingDto } from '../models/update-rating.dto'
import { ProductReviewDto } from 'src/modules/product/models/product-review.dto'

import { ProductService } from 'src/modules/product/services/product.service'
import { UserService } from 'src/modules/user/services/user.service'

import { ForbiddenException } from 'src/exceptions/forbidden/forbidden.exception'

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
    @Inject(forwardRef(() => ProductService))
    private readonly productService: ProductService,
    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService
  ) {
    super(repository)
  }

  /**
   * Method that can create a new rating entity
   * @param requestUser stores the logged user data
   * @param createRatingPayload stores the new rating data
   * @returns the created rating entity
   */
  public async create(
    requestUser: UserEntity,
    createRatingPayload: CreateRatingDto
  ): Promise<RatingEntity> {
    const { userId, productId } = createRatingPayload

    /* If there are no products or users with the passed id those
    services will throw "EntityNotFoundException", if the request
    user has no permission the "UserService" will throw "ForbiddenException" */

    const user = await this.userService.get(userId, requestUser)
    const product = await this.productService.get(productId)

    return await new RatingEntity({
      ...createRatingPayload,
      user,
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
   * Method that can get a review of the product ratings
   * @param productId stores the product id
   * @returns the product review
   */
  public async getReviewByProductId(
    productId: number
  ): Promise<ProductReviewDto> {
    const response: { stars: number; amount: number }[] = await this.repository
      .createQueryBuilder('rating')
      .select(['rating.stars as stars', 'count(rating.id) as amount'])
      .where(`rating.productId = ${productId}`)
      .groupBy('rating.stars')
      .getRawMany()

    const filteredArray = response.filter(
      entity => entity.stars !== undefined && entity.amount !== undefined
    )

    const amounts = filteredArray.map(entity => entity.amount)
    const pond = filteredArray.map(entity => entity.amount * entity.stars)

    const total =
      amounts.length === 0 ? 0 : amounts.reduce((prev, value) => prev + value)

    return {
      five: response.filter(entity => entity.stars === 5)[0]?.amount,
      four: response.filter(entity => entity.stars === 4)[0]?.amount,
      three: response.filter(entity => entity.stars === 3)[0]?.amount,
      two: response.filter(entity => entity.stars === 2)[0]?.amount,
      one: response.filter(entity => entity.stars === 1)[0]?.amount,
      zero: response.filter(entity => entity.stars === 0)[0]?.amount,
      average:
        pond.length === 0
          ? 0
          : pond.reduce((prev, value) => prev + value) / total,
      total
    }
  }

  /**
   * Method that can change some entity data
   * @param ratingId stores the rating entity id
   * @param updateRatingPayload stores the rating entity new data
   */
  public async update(
    ratingId: number,
    requestUser: UserEntity,
    updateRatingPayload: UpdateRatingDto
  ): Promise<void> {
    const entity = await RatingEntity.findOne({ id: ratingId })

    if (!entity || !entity.isActive) {
      throw new EntityNotFoundException(ratingId, RatingEntity)
    }

    if (!this.userService.hasPermissions(entity.userId, requestUser)) {
      throw new ForbiddenException()
    }

    await RatingEntity.update({ id: ratingId }, updateRatingPayload)
  }

  /**
   * Method that can remove some rating entity from the database
   * @param ratingId stores the rating entity id
   */
  public async delete(
    ratingId: number,
    requestUser: UserEntity
  ): Promise<void> {
    const entity = await RatingEntity.findOne({ id: ratingId })

    if (!entity || !entity.isActive) {
      throw new EntityNotFoundException(ratingId, RatingEntity)
    }

    if (!this.userService.hasPermissions(entity.userId, requestUser)) {
      throw new ForbiddenException()
    }

    await RatingEntity.delete({ id: ratingId })
  }

  /**
   * Method that can disables some rating entity
   * @param ratingId stores the rating entity id
   */
  public async disable(
    ratingId: number,
    requestUser: UserEntity
  ): Promise<void> {
    const entity = await RatingEntity.findOne({ id: ratingId })

    if (!entity) {
      throw new EntityNotFoundException(ratingId, RatingEntity)
    }

    if (!this.userService.hasPermissions(entity.userId, requestUser)) {
      throw new ForbiddenException()
    }

    if (!entity.isActive) {
      throw new EntityAlreadyDisabledException(ratingId, RatingEntity)
    }

    await RatingEntity.update({ id: ratingId }, { isActive: false })
  }

  /**
   * Method that can disables some rating entity
   * @param ratingId stores the rating entity id
   */
  public async enable(
    ratingId: number,
    requestUser: UserEntity
  ): Promise<void> {
    const entity = await RatingEntity.findOne({ id: ratingId })

    if (!entity) {
      throw new EntityNotFoundException(ratingId, RatingEntity)
    }

    if (!this.userService.hasPermissions(entity.userId, requestUser)) {
      throw new ForbiddenException()
    }

    if (entity.isActive) {
      throw new EntityAlreadyEnabledException(ratingId, RatingEntity)
    }

    await RatingEntity.update({ id: ratingId }, { isActive: true })
  }
}
