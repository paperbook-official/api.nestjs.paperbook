import { forwardRef, Inject, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { CrudRequest } from '@nestjsx/crud'
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm'
import { Repository } from 'typeorm'

import { RatingEntity } from '../entities/rating.entity'
import { EntityAlreadyDisabledException } from 'src/exceptions/conflict/entity-already-disabled.exception'
import { EntityAlreadyEnabledException } from 'src/exceptions/conflict/entity-already-enabled.exception'
import { EntityNotFoundException } from 'src/exceptions/not-found/entity-not-found.exception'

import { CreateRatingPayload } from '../models/create-rating.payload'
import { UpdateRatingPayload } from '../models/update-rating.payload'

import { ProductService } from 'src/modules/product/services/product.service'
import { UserService } from 'src/modules/user/services/user.service'

import { RequestUser } from 'src/utils/type.shared'

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
    requestUser: RequestUser,
    createRatingPayload: CreateRatingPayload
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
   * Method that can change some entity data
   * @param ratingId stores the rating entity id
   * @param updateRatingPayload stores the rating entity new data
   */
  public async update(
    ratingId: number,
    requestUser: RequestUser,
    updateRatingPayload: UpdateRatingPayload
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
    requestUser: RequestUser
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
    requestUser: RequestUser
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
    requestUser: RequestUser
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
