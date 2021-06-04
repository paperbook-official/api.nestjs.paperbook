import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { CrudRequest, GetManyDefaultResponse } from '@nestjsx/crud'
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm'
import { Repository } from 'typeorm'

import { EntityAlreadyDisabledException } from 'src/exceptions/conflict/entity-already-disabled.exception'
import { EntityAlreadyEnabledException } from 'src/exceptions/conflict/entity-already-enabled.exception'
import { ForbiddenException } from 'src/exceptions/forbidden/forbidden.exception'
import { EntityNotFoundException } from 'src/exceptions/not-found/entity-not-found.exception'

import { ShoppingCartEntity } from '../entities/shopping-cart.entity'
import { UserEntity } from 'src/modules/user/entities/user.entity'

import { CreateShoppingCartDto } from '../models/create-shopping-cart.dto'
import { UpdateShoppingCartDto } from '../models/update-shopping-cart.dto'

import { UserService } from 'src/modules/user/services/user.service'

import { some } from 'src/utils/crud'

@Injectable()
export class ShoppingCartService extends TypeOrmCrudService<
  ShoppingCartEntity
> {
  public constructor(
    @InjectRepository(ShoppingCartEntity)
    repository: Repository<ShoppingCartEntity>,
  ) {
    super(repository)
  }

  /**
   * Method that can create a new shopping cart entity
   *
   * @param requestUser stores the logged user data
   * @param createShoppingCartDto stores the new shopping
   * cart entity data
   * @throws {EntityNotFoundException} if the user was not found
   * @throws {ForbiddenException} if the request user has no permission
   * to access those sources
   * @returns the created shopping cart entity
   */
  public async create(
    requestUser: UserEntity,
    createShoppingCartDto: CreateShoppingCartDto,
  ): Promise<ShoppingCartEntity> {
    const { userId } = createShoppingCartDto

    const user = await UserEntity.findOne({ id: userId })

    if (!user) {
      throw new EntityNotFoundException(userId, UserEntity)
    }

    if (!UserService.hasPermissions(userId, requestUser)) {
      throw new ForbiddenException()
    }

    return await new ShoppingCartEntity({
      ...createShoppingCartDto,
      user,
    }).save()
  }

  /**
   * Method that can get only on shopping cart entity
   *
   * @param shoppingCartId stores the shopping cart id
   * @param requestUser stores the logged user
   * @param crudRequest stores the joins, filters, etc
   * @throws {EntityNotFoundException} if the shopping card was not found
   * @throws {ForbiddenException} if the request user has no permission
   * to access those sources
   * @returns the found shopping cart entity
   */
  public async listOne(
    shoppingCartId: number,
    requestUser: UserEntity,
    crudRequest?: CrudRequest,
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

    if (!UserService.hasPermissions(entity.userId, requestUser)) {
      throw new ForbiddenException()
    }

    return entity
  }

  /**
   * Method that can get shopping cart entities
   *
   * @param requestUser stores the logged user
   * @param crudRequest stores the joins, filters, etc
   * @throws {ForbiddenException} if the request user has no permission
   * to access those sources
   * @returns all the found shopping cart entities
   */
  public async listMany(
    requestUser: UserEntity,
    crudRequest?: CrudRequest,
  ): Promise<
    GetManyDefaultResponse<ShoppingCartEntity> | ShoppingCartEntity[]
  > {
    const entities = await super.getMany(crudRequest)

    if (
      !some(entities, entity =>
        UserService.hasPermissions(entity.userId, requestUser),
      )
    ) {
      throw new ForbiddenException()
    }

    return entities
  }

  /**
   * Method that can change data of some shopping cart entity
   *
   * @param shoppingCartId stores the shopping cart id
   * @param updateShoppingCartPayload stores the shopping cart new data
   * @throws {EntityNotFoundException} if the shopping card was not found
   */
  public async update(
    shoppingCartId: number,
    updateShoppingCartPayload: UpdateShoppingCartDto,
  ): Promise<void> {
    const entity = await ShoppingCartEntity.findOne({ id: shoppingCartId })

    if (!entity || !entity.isActive) {
      throw new EntityNotFoundException(shoppingCartId, ShoppingCartEntity)
    }

    await ShoppingCartEntity.update(
      { id: shoppingCartId },
      updateShoppingCartPayload,
    )
  }

  /**
   * Method that can delete some shopping cart entity
   *
   * @param shoppingCartId stores the shopping cart id
   * @param requestUser stores the logged user data
   * @throws {EntityNotFoundException} if the shopping card was not found
   * @throws {ForbiddenException} if the request user has no permission
   * to access those sources
   */
  public async delete(
    shoppingCartId: number,
    requestUser: UserEntity,
  ): Promise<void> {
    const entity = await ShoppingCartEntity.findOne({ id: shoppingCartId })

    if (!entity || !entity.isActive) {
      throw new EntityNotFoundException(shoppingCartId, ShoppingCartEntity)
    }

    if (!UserService.hasPermissions(entity.userId, requestUser)) {
      throw new ForbiddenException()
    }

    await ShoppingCartEntity.delete({ id: shoppingCartId })
  }

  /**
   * Method that can disables some shopping cart entity
   *
   * @param shoppingCartId stores the shopping cart entity id
   * @throws {EntityNotFoundException} if the shopping cart was not found
   * @throws {ForbiddenException} if the request user has no permission
   * to access those sources
   * @throws {EntityAlreadyDisabledException} if the shopping cart is already disabled
   */
  public async disable(shoppingCartId: number): Promise<void> {
    const entity = await ShoppingCartEntity.findOne({ id: shoppingCartId })

    if (!entity) {
      throw new EntityNotFoundException(shoppingCartId, ShoppingCartEntity)
    }

    if (!entity.isActive) {
      throw new EntityAlreadyDisabledException(
        shoppingCartId,
        ShoppingCartEntity,
      )
    }

    await ShoppingCartEntity.update({ id: shoppingCartId }, { isActive: false })
  }

  /**
   * Method that can enables some shopping cart entity
   *
   * @param shoppingCartId stores the shopping cart entity id
   * @throws {EntityNotFoundException} if the shopping cart was not found
   * @throws {ForbiddenException} if the request user has no permission
   * to access those sources
   * @throws {EntityAlreadyEnabledException} if the shopping cart is already enabled
   */
  public async enable(shoppingCartId: number): Promise<void> {
    const entity = await ShoppingCartEntity.findOne({ id: shoppingCartId })

    if (!entity) {
      throw new EntityNotFoundException(shoppingCartId, ShoppingCartEntity)
    }

    if (entity.isActive) {
      throw new EntityAlreadyEnabledException(
        shoppingCartId,
        ShoppingCartEntity,
      )
    }

    await ShoppingCartEntity.update({ id: shoppingCartId }, { isActive: true })
  }
}
