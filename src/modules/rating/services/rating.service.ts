import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { CrudRequest } from '@nestjsx/crud'
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm'
import { Repository } from 'typeorm'

import { EntityAlreadyDisabledException } from 'src/exceptions/conflict/entity-already-disabled.exception'
import { EntityAlreadyEnabledException } from 'src/exceptions/conflict/entity-already-enabled.exception'
import { ForbiddenException } from 'src/exceptions/forbidden/forbidden.exception'
import { EntityNotFoundException } from 'src/exceptions/not-found/entity-not-found.exception'

import { RatingEntity } from '../entities/rating.entity'
import { ProductEntity } from 'src/modules/product/entities/product.entity'
import { UserEntity } from 'src/modules/user/entities/user.entity'

import { CreateRatingDto } from '../models/create-rating.dto'
import { UpdateRatingDto } from '../models/update-rating.dto'
import { ProductReviewDto } from 'src/modules/product/models/product-review.dto'

import { UserService } from 'src/modules/user/services/user.service'

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
  ) {
    super(repository)
  }

  /**
   * Method that can create a new rating entity
   *
   * @param requestUser stores the logged user data
   * @param createRatingPayload stores the new rating data
   * @throws {EntityNotFoundException} if the user was not found
   * @throws {EntityNotFoundException} if the product was not found
   * @throws {ForbiddenException} if the request user has no permission
   * to access those sources
   * @returns the created rating entity
   */
  public async create(
    requestUser: UserEntity,
    createRatingPayload: CreateRatingDto,
  ): Promise<RatingEntity> {
    const { userId, productId } = createRatingPayload

    const user = await UserEntity.findOne({ id: userId })

    if (!user) {
      throw new EntityNotFoundException(userId, UserEntity)
    }

    if (!UserService.hasPermissions(userId, requestUser)) {
      throw new ForbiddenException()
    }

    const product = await ProductEntity.findOne({ id: productId })

    if (!product) {
      throw new EntityNotFoundException(productId, ProductEntity)
    }

    return await new RatingEntity({
      ...createRatingPayload,
      user,
      product,
    }).save()
  }

  /**
   * Method that can only one rating entity
   *
   * @param ratingId stores the rating id
   * @param crudRequest stores the joins, filters, etc
   * @throws {EntityNotFoundException} if the rating was not found
   * @returns the found rating entity
   */
  public async listOne(
    ratingId: number,
    crudRequest?: CrudRequest,
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
   *
   * @param productId stores the product id
   * @returns the product review
   */
  public async listReviewByProductId(
    productId: number,
  ): Promise<ProductReviewDto> {
    const response: { stars: number; amount: number }[] = await this.repository
      .createQueryBuilder('rating')
      .select(['rating.stars as stars', 'count(rating.id) as amount'])
      .where(`rating.productId = ${productId}`)
      .groupBy('rating.stars')
      .getRawMany()

    const filteredArray = response.filter(
      entity => entity.stars !== undefined && entity.amount !== undefined,
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
      total,
    }
  }

  /**
   * Method that can change some entity data
   *
   * @param ratingId stores the rating entity id
   * @param requestUser stores the logged user data
   * @param updateRatingPayload stores the rating entity new data
   * @throws {EntityNotFoundException} if the rating was not found
   * @throws {ForbiddenException} if the request user has no permission
   * to access those sources
   */
  public async update(
    ratingId: number,
    requestUser: UserEntity,
    updateRatingPayload: UpdateRatingDto,
  ): Promise<void> {
    const entity = await RatingEntity.findOne({ id: ratingId })

    if (!entity || !entity.isActive) {
      throw new EntityNotFoundException(ratingId, RatingEntity)
    }

    if (!UserService.hasPermissions(entity.userId, requestUser)) {
      throw new ForbiddenException()
    }

    await RatingEntity.update({ id: ratingId }, updateRatingPayload)
  }

  /**
   * Method that can remove some rating entity from the database
   *
   * @param ratingId stores the rating entity id
   * @param requestUser stores the logged user data
   * @throws {EntityNotFoundException} if the rating was not found
   * @throws {ForbiddenException} if the request user has no permission
   * to access those sources
   */
  public async delete(
    ratingId: number,
    requestUser: UserEntity,
  ): Promise<void> {
    const entity = await RatingEntity.findOne({ id: ratingId })

    if (!entity || !entity.isActive) {
      throw new EntityNotFoundException(ratingId, RatingEntity)
    }

    if (!UserService.hasPermissions(entity.userId, requestUser)) {
      throw new ForbiddenException()
    }

    await RatingEntity.delete({ id: ratingId })
  }

  /**
   * Method that can disables some rating entity
   *
   * @param ratingId stores the rating entity id
   * @param requestUser stores the logged user data
   * @throws {EntityNotFoundException} if the rating was not found
   * @throws {ForbiddenException} if the request user has no permission
   * to access those sources
   * @throws {EntityAlreadyDisabledException} if the rating is already disabled
   */
  public async disable(
    ratingId: number,
    requestUser: UserEntity,
  ): Promise<void> {
    const entity = await RatingEntity.findOne({ id: ratingId })

    if (!entity) {
      throw new EntityNotFoundException(ratingId, RatingEntity)
    }

    if (!UserService.hasPermissions(entity.userId, requestUser)) {
      throw new ForbiddenException()
    }

    if (!entity.isActive) {
      throw new EntityAlreadyDisabledException(ratingId, RatingEntity)
    }

    await RatingEntity.update({ id: ratingId }, { isActive: false })
  }

  /**
   * Method that can disables some rating entity
   *
   * @param ratingId stores the rating entity id
   * @param requestUser stores the logged user data
   * @throws {EntityNotFoundException} if the rating was not found
   * @throws {ForbiddenException} if the request user has no permission
   * to access those sources
   * @throws {EntityAlreadyEnabledException} if the rating is already enabled
   */
  public async enable(
    ratingId: number,
    requestUser: UserEntity,
  ): Promise<void> {
    const entity = await RatingEntity.findOne({ id: ratingId })

    if (!entity) {
      throw new EntityNotFoundException(ratingId, RatingEntity)
    }

    if (!UserService.hasPermissions(entity.userId, requestUser)) {
      throw new ForbiddenException()
    }

    if (entity.isActive) {
      throw new EntityAlreadyEnabledException(ratingId, RatingEntity)
    }

    await RatingEntity.update({ id: ratingId }, { isActive: true })
  }
}
