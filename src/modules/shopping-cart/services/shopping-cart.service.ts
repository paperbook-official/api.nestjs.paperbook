import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm'
import { Repository } from 'typeorm'

import { ShoppingCartEntity } from '../entities/shopping-cart.entity'

import { CreateShoppingCartPayload } from '../models/create-shopping-cart.payload'

import { ProductService } from 'src/modules/product/services/product.service'
import { UserService } from 'src/modules/user/services/user.service'

import { RequestUser } from 'src/utils/type.shared'

@Injectable()
export class ShoppingCartService extends TypeOrmCrudService<
  ShoppingCartEntity
> {
  public constructor(
    @InjectRepository(ShoppingCartEntity)
    private readonly repository: Repository<ShoppingCartEntity>,
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
    requestUser: RequestUser,
    createShoppingCartPayload: CreateShoppingCartPayload
  ): Promise<ShoppingCartEntity> {
    const { productId, userId } = createShoppingCartPayload

    /* If there are no products or users with the passed id those
    services will throw "EntityNotFoundException", if the request
    user has no permission the "UserService" will throw "ForbiddenException" */

    const product = await this.productService.get(productId)
    const user = await this.userService.get(userId, requestUser)

    return await new ShoppingCartEntity({
      ...createShoppingCartPayload,
      product,
      user
    }).save()
  }
}
