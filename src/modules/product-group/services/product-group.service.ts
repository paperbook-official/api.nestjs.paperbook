import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm'
import { Repository } from 'typeorm'

import { ProductGroupEntity } from '../entities/product-group.entity'
import { UserEntity } from 'src/modules/user/entities/user.entity'

import { CreateProductGroupDto } from '../models/create-product-group.dto'

import { ProductService } from 'src/modules/product/services/product.service'
import { ShoppingCartService } from 'src/modules/shopping-cart/services/shopping-cart.service'

/**
 * The app's main product group service clas
 *
 * Class that deals with the product groupo data
 */
@Injectable()
export class ProductGroupService extends TypeOrmCrudService<
  ProductGroupEntity
> {
  public constructor(
    @InjectRepository(ProductGroupEntity)
    repository: Repository<ProductGroupEntity>,
    private readonly productService: ProductService,
    private readonly shoppingCartService: ShoppingCartService
  ) {
    super(repository)
  }

  /**
   * Method that can create a new product group entity
   * @param requestUser stores the logged user data
   * @param createProductGroupPayload stores the new product group data
   * @returns the created product group entity
   */
  public async create(
    requestUser: UserEntity,
    createProductGroupPayload: CreateProductGroupDto
  ): Promise<ProductGroupEntity> {
    const { productId, shoppingCartId } = createProductGroupPayload

    /* If there are no products or shopping carts with the passed id those
    services will throw "EntityNotFoundException", if the request
    user has no permission the "UserService" will throw "ForbiddenException" */

    const product = await this.productService.get(productId)
    const shoppingCart = await this.shoppingCartService.get(
      shoppingCartId,
      requestUser
    )

    return await new ProductGroupEntity({
      ...createProductGroupPayload,
      product,
      shoppingCart
    }).save()
  }
}
