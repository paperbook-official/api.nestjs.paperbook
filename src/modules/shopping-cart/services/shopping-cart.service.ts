import { forwardRef, Inject, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { CrudRequest, GetManyDefaultResponse } from '@nestjsx/crud'
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm'
import { Repository } from 'typeorm'

import { ShoppingCartEntity } from '../entities/shopping-cart.entity'
import { EntityAlreadyDisabledException } from 'src/exceptions/conflict/entity-already-disabled.exception'
import { EntityAlreadyEnabledException } from 'src/exceptions/conflict/entity-already-enabled.exception'
import { EntityNotFoundException } from 'src/exceptions/not-found/entity-not-found.exception'
import { UserEntity } from 'src/modules/user/entities/user.entity'

import { CreateShoppingCartDto } from '../models/create-shopping-cart.dto'
import { UpdateShoppingCartDto } from '../models/update-shopping-cart.dto'

import { ProductService } from 'src/modules/product/services/product.service'
import { UserService } from 'src/modules/user/services/user.service'

import { some } from 'src/utils/crud'

import { ForbiddenException } from 'src/exceptions/forbidden/forbidden.exception'

@Injectable()
export class ShoppingCartService extends TypeOrmCrudService<
  ShoppingCartEntity
> {
  public constructor(
    @InjectRepository(ShoppingCartEntity)
    private readonly repository: Repository<ShoppingCartEntity>,
    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService,
    private readonly productService: ProductService
  ) {
    super(repository)
  }

  /**
   * Method that can create a new shopping cart entity
   * @param requestUser stores the logged user data
   * @param createShoppingCartPayload stores the new shopping
   * cart entity data
   * @returns the created shopping cart entity
   */
  public async create(
    requestUser: UserEntity,
    createShoppingCartPayload: CreateShoppingCartDto
  ): Promise<ShoppingCartEntity> {
    const { userId } = createShoppingCartPayload

    /* If there are no products or users with the passed id those
    services will throw "EntityNotFoundException", if the request
    user has no permission the "UserService" will throw "ForbiddenException" */

    const user = await this.userService.get(userId, requestUser)

    return await new ShoppingCartEntity({
      ...createShoppingCartPayload,
      user
    }).save()
  }

  /**
   * Method that can get only on shopping cart entity
   * @param shoppingCartId stores the shopping cart id
   * @param requestUser stores the logged user
   * @param crudRequest stores the joins, filters, etc
   * @returns the found shopping cart entity
   */
  public async get(
    shoppingCartId: number,
    requestUser: UserEntity,
    crudRequest?: CrudRequest
  ): Promise<ShoppingCartEntity> {
    let entity: ShoppingCartEntity

    entity = await super.getOne(crudRequest).catch(() => undefined)
    if (crudRequest) {
    } else {
      entity = await ShoppingCartEntity.findOne({ id: shoppingCartId })
    }

    if (!entity || !entity.isActive) {
      throw new EntityNotFoundException(shoppingCartId, ShoppingCartEntity)
    }

    if (!this.userService.hasPermissions(entity.userId, requestUser)) {
      throw new ForbiddenException()
    }

    return entity
  }

  /**
   * Method that can get shopping cart entities
   * @param requestUser stores the logged user
   * @param crudRequest stores the joins, filters, etc
   * @returns all the found shopping cart entities
   */
  public async getMore(
    requestUser: UserEntity,
    crudRequest?: CrudRequest
  ): Promise<
    GetManyDefaultResponse<ShoppingCartEntity> | ShoppingCartEntity[]
  > {
    const entities = await super.getMany(crudRequest)

    if (
      !some(entities, entity =>
        this.userService.hasPermissions(entity.userId, requestUser)
      )
    ) {
      throw new ForbiddenException()
    }

    return entities
  }

  /**
   * Method that can change data of some shopping cart entity
   * @param shoppingCartId stores the shopping cart id
   * @param updateShoppingCartPayload stores the shopping cart new data
   */
  public async update(
    shoppingCartId: number,
    updateShoppingCartPayload: UpdateShoppingCartDto
  ): Promise<void> {
    const entity = await ShoppingCartEntity.findOne({ id: shoppingCartId })

    if (!entity || !entity.isActive) {
      throw new EntityNotFoundException(shoppingCartId, ShoppingCartEntity)
    }

    await ShoppingCartEntity.update(
      { id: shoppingCartId },
      updateShoppingCartPayload
    )
  }

  /**
   * Method that can delete some shopping cart entity
   * @param shoppingCartId stores the shopping cart id
   * @param requestUser stores the logged user data
   */
  public async delete(
    shoppingCartId: number,
    requestUser: UserEntity
  ): Promise<void> {
    const entity = await ShoppingCartEntity.findOne({ id: shoppingCartId })

    if (!entity || !entity.isActive) {
      throw new EntityNotFoundException(shoppingCartId, ShoppingCartEntity)
    }

    if (!this.userService.hasPermissions(entity.userId, requestUser)) {
      throw new ForbiddenException()
    }

    await ShoppingCartEntity.delete({ id: shoppingCartId })
  }

  /**
   * Method that can disables some shopping cart entity
   * @param shoppingCartId stores the shopping cart entity id
   */
  public async disable(shoppingCartId: number): Promise<void> {
    const entity = await ShoppingCartEntity.findOne({ id: shoppingCartId })

    if (!entity) {
      throw new EntityNotFoundException(shoppingCartId, ShoppingCartEntity)
    }

    if (!entity.isActive) {
      throw new EntityAlreadyDisabledException(
        shoppingCartId,
        ShoppingCartEntity
      )
    }

    await ShoppingCartEntity.update({ id: shoppingCartId }, { isActive: false })
  }

  /**
   * Method that can enables some shopping cart entity
   * @param shoppingCartId stores the shopping cart entity id
   */
  public async enable(shoppingCartId: number): Promise<void> {
    const entity = await ShoppingCartEntity.findOne({ id: shoppingCartId })

    if (!entity) {
      throw new EntityNotFoundException(shoppingCartId, ShoppingCartEntity)
    }

    if (entity.isActive) {
      throw new EntityAlreadyEnabledException(
        shoppingCartId,
        ShoppingCartEntity
      )
    }

    await ShoppingCartEntity.update({ id: shoppingCartId }, { isActive: true })
  }
}
