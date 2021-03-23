import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm'
import { Repository } from 'typeorm'

import { OrderEntity } from '../entities/order.entity'

import { CreateOrderPayload } from '../models/create-order.payload'

import { ProductService } from 'src/modules/product/services/product.service'
import { UserService } from 'src/modules/user/services/user.service'

import { RequestUser } from 'src/utils/type.shared'

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
}
