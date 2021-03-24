import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { CrudRequest, GetManyDefaultResponse } from '@nestjsx/crud'
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm'
import { Repository } from 'typeorm'

import { OrderEntity } from '../entities/order.entity'
import { EntityNotFoundException } from 'src/exceptions/not-found/entity-not-found.exception'

import { CreateOrderPayload } from '../models/create-order.payload'

import { ProductService } from 'src/modules/product/services/product.service'
import { UserService } from 'src/modules/user/services/user.service'

import { some } from 'src/utils/crud'
import { RequestUser } from 'src/utils/type.shared'

import { ForbiddenException } from 'src/exceptions/forbidden/forbidden.exception'
import { UpdateOrderPayload } from '../models/update-order.payload'

/**
 * The app's main order service class
 *
 * Class that deals with the orders data
 */
@Injectable()
export class OrderService extends TypeOrmCrudService<OrderEntity> {
  public constructor(
    @InjectRepository(OrderEntity)
    private readonly repository: Repository<OrderEntity>,
    private readonly userService: UserService,
    private readonly productService: ProductService
  ) {
    super(repository)
  }

  /**
   * Method that can save some order entity in the database
   * @param requestUser stores the logged user data
   * @param createOrderPayload stores the order new data
   * @returns the created order
   */
  public async create(
    requestUser: RequestUser,
    createOrderPayload: CreateOrderPayload
  ): Promise<OrderEntity> {
    const { userId, productId } = createOrderPayload

    const user = await this.userService.get(userId, requestUser)
    const product = await this.productService.get(productId)

    const entity = new OrderEntity({
      ...createOrderPayload,
      user,
      product
    })

    return await entity.save()
  }

  /**
   * Method that can get only on order entity
   * @param orderId stores the order id
   * @param requestUser stores the logged user data
   * @param crudRequest stores the joins, filters, etc
   * @returns the found entity
   */
  public async get(
    orderId: number,
    requestUser: RequestUser,
    crudRequest?: CrudRequest
  ): Promise<OrderEntity> {
    let entity: OrderEntity

    if (crudRequest) {
      entity = await super.getOne(crudRequest).catch(() => undefined)
    } else {
      entity = await OrderEntity.findOne({ id: orderId })
    }

    if (!entity || !entity.isActive) {
      throw new EntityNotFoundException(orderId, OrderEntity)
    }

    if (!this.userService.hasPermissions(entity.id, requestUser)) {
      throw new ForbiddenException()
    }

    return entity
  }

  /**
   * Method that can get some orders entities
   * @param requestUser stores the logged user data
   * @param crudRequest stores the joins, filters, etc
   * @returns the found elements
   */
  public async getMore(
    requestUser: RequestUser,
    crudRequest?: CrudRequest
  ): Promise<GetManyDefaultResponse<OrderEntity> | OrderEntity[]> {
    const entities = await super.getMany(crudRequest)

    if (
      some(
        entities,
        entity => !this.userService.hasPermissions(entity.userId, requestUser)
      )
    ) {
      throw new ForbiddenException()
    }

    return entities
  }

  /**
   * Method that can change some data of some entity
   * @param orderId stores the order id
   * @param requestUser stores the logged user data
   * @param updateOrderPayload stores the new order data
   */
  public async update(
    orderId: number,
    requestUser: RequestUser,
    updateOrderPayload: UpdateOrderPayload
  ): Promise<void> {
    const entity = await OrderEntity.findOne({ id: orderId })

    if (!entity || !entity.isActive) {
      throw new EntityNotFoundException(orderId)
    }

    if (!this.userService.hasPermissions(entity.userId, requestUser)) {
      throw new ForbiddenException()
    }

    await OrderEntity.update({ id: orderId }, updateOrderPayload)
  }
}
