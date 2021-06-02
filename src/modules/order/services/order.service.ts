import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { CrudRequest, GetManyDefaultResponse } from '@nestjsx/crud'
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm'
import { Repository } from 'typeorm'

import { EntityAlreadyDisabledException } from 'src/exceptions/conflict/entity-already-disabled.exception'
import { EntityAlreadyEnabledException } from 'src/exceptions/conflict/entity-already-enabled.exception'
import { ForbiddenException } from 'src/exceptions/forbidden/forbidden.exception'
import { EntityNotFoundException } from 'src/exceptions/not-found/entity-not-found.exception'

import { OrderEntity } from '../entities/order.entity'
import { UserEntity } from 'src/modules/user/entities/user.entity'

import { CreateOrderDto } from '../models/create-order.dto'
import { UpdateOrderDto } from '../models/update-order.dto'

import { UserService } from 'src/modules/user/services/user.service'

import { some } from 'src/utils/crud'

/**
 * The app's main order service class
 *
 * Class that deals with the orders data
 */
@Injectable()
export class OrderService extends TypeOrmCrudService<OrderEntity> {
  public constructor(
    @InjectRepository(OrderEntity)
    repository: Repository<OrderEntity>,
  ) {
    super(repository)
  }

  /**
   * Method that can save some order entity in the database
   *
   * @param requestUser stores the logged user data
   * @param createOrderPayload stores the order new data
   * @throws {EntityNotFoundException} if the user was not found
   * @throws {ForbiddenException} if the logged user has no permission to access
   * those sources
   * @returns the created order entity
   */
  public async create(
    requestUser: UserEntity,
    createOrderPayload: CreateOrderDto,
  ): Promise<OrderEntity> {
    const { userId } = createOrderPayload

    const user = await UserEntity.findOne({ id: userId })

    if (!user) {
      throw new EntityNotFoundException(userId, UserEntity)
    }

    if (!UserService.hasPermissions(userId, requestUser)) {
      throw new ForbiddenException()
    }

    const entity = new OrderEntity({
      ...createOrderPayload,
      trackingCode: OrderService.generateTrackingCode(),
      user,
    })

    return await entity.save()
  }

  /**
   * Method that can get some orders entities
   *
   * @param requestUser stores the logged user data
   * @param crudRequest stores the joins, filters, etc
   * @throws {ForbiddenException} if the logged user has no permission to access
   * those sources
   * @returns the found elements
   */
  public async listMany(
    requestUser: UserEntity,
    crudRequest?: CrudRequest,
  ): Promise<GetManyDefaultResponse<OrderEntity> | OrderEntity[]> {
    const entities = await super.getMany(crudRequest)

    if (
      some(
        entities,
        entity => !UserService.hasPermissions(entity.userId, requestUser),
      )
    ) {
      throw new ForbiddenException()
    }

    return entities
  }

  /**
   * Method that can get only on order entity
   *
   * @param orderId stores the order id
   * @param requestUser stores the logged user data
   * @param crudRequest stores the joins, filters, etc
   * @throws {EntityNotFoundException} if the order was not found
   * @throws {ForbiddenException} if the logged user has no permission to access
   * those sources
   * @returns the found order entity
   */
  public async listOne(
    orderId: number,
    requestUser: UserEntity,
    crudRequest?: CrudRequest,
  ): Promise<OrderEntity> {
    const entity = crudRequest
      ? await super.getOne(crudRequest).catch(() => undefined)
      : await OrderEntity.findOne({ id: orderId })

    if (!entity || !entity.isActive) {
      throw new EntityNotFoundException(orderId, OrderEntity)
    }

    if (!UserService.hasPermissions(entity.userId, requestUser)) {
      throw new ForbiddenException()
    }

    return entity
  }

  /**
   * Method that can change some data of some entity
   *
   * @param orderId stores the order id
   * @param requestUser stores the logged user data
   * @param updateOrderPayload stores the new order data
   * @throws {EntityNotFoundException} if the order was not found
   * @throws {ForbiddenException} if the logged user has no permission to access
   * those sources
   */
  public async update(
    orderId: number,
    requestUser: UserEntity,
    updateOrderPayload: UpdateOrderDto,
  ): Promise<void> {
    const entity = await OrderEntity.findOne({ id: orderId })

    if (!entity || !entity.isActive) {
      throw new EntityNotFoundException(orderId, OrderEntity)
    }

    if (!UserService.hasPermissions(entity.userId, requestUser)) {
      throw new ForbiddenException()
    }

    await OrderEntity.update({ id: orderId }, updateOrderPayload)
  }

  /**
   * Method that removes some order entity
   *
   * @param orderId stores the order id
   * @param requestUser stores the logged user data
   * @throws {EntityNotFoundException} if the order was not found
   * @throws {ForbiddenException} if the logged user has no permission to access
   * those sources
   */
  public async delete(orderId: number, requestUser: UserEntity): Promise<void> {
    const entity = await OrderEntity.findOne({ id: orderId })

    if (!entity || !entity.isActive) {
      throw new EntityNotFoundException(orderId, OrderEntity)
    }

    if (!UserService.hasPermissions(entity.userId, requestUser)) {
      throw new ForbiddenException()
    }

    await OrderEntity.delete({ id: orderId })
  }

  /**
   * Method that can disable some entity
   *
   * @param orderId stores the order id
   * @param requestUser stores the logged user data
   * @throws {EntityNotFoundException} if the order was not found
   * @throws {ForbiddenException} if the request user has no permission
   * to access those sources
   * @throws {EntityAlreadyDisabledException} if the order is already disabled   */
  public async disable(
    orderId: number,
    requestUser: UserEntity,
  ): Promise<void> {
    const entity = await OrderEntity.findOne({ id: orderId })

    if (!entity) {
      throw new EntityNotFoundException(orderId, OrderEntity)
    }

    if (!entity.isActive) {
      throw new EntityAlreadyDisabledException(orderId, OrderEntity)
    }

    if (!UserService.hasPermissions(entity.userId, requestUser)) {
      throw new ForbiddenException()
    }

    await OrderEntity.update({ id: orderId }, { isActive: false })
  }

  /**
   * Method that can enable some entity
   *
   * @param orderId stores the order id
   * @param requestUser stores the logged user
   * @throws {EntityNotFoundException} if the order was not found
   * @throws {ForbiddenException} if the request user has no permission
   * to access those sources
   * @throws {EntityAlreadyEnabledException} if the order is already enabled
   */
  public async enable(orderId: number, requestUser: UserEntity): Promise<void> {
    const entity = await OrderEntity.findOne({ id: orderId })

    if (!entity) {
      throw new EntityNotFoundException(orderId, OrderEntity)
    }

    if (entity.isActive) {
      throw new EntityAlreadyEnabledException(orderId, OrderEntity)
    }

    if (!UserService.hasPermissions(entity.userId, requestUser)) {
      throw new ForbiddenException()
    }

    await OrderEntity.update({ id: orderId }, { isActive: true })
  }

  /**
   * Method that creates a new tracking code string
   *
   * @returns the generated tracking code
   */
  public static generateTrackingCode(): string {
    return 'xxxxxxxxxxxxx'.replace(/[x]/g, (c: string) => {
      const r = (Math.random() * 16) | 0
      const v = c == 'x' ? r : (r & 0x3) | 0x8
      return v.toString(16).toUpperCase()
    })
  }
}
