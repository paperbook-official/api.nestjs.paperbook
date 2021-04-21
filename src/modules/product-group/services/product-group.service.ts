import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { CrudRequest } from '@nestjsx/crud'
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm'
import { Repository } from 'typeorm'

import { ProductGroupEntity } from '../entities/product-group.entity'
import { EntityAlreadyDisabledException } from 'src/exceptions/conflict/entity-already-disabled.exception'
import { EntityAlreadyEnabledException } from 'src/exceptions/conflict/entity-already-enabled.exception'
import { EntityNotFoundException } from 'src/exceptions/not-found/entity-not-found.exception'
import { UserEntity } from 'src/modules/user/entities/user.entity'

import { CreateProductGroupDto } from '../models/create-product-group.dto'
import { UpdateProductGroupDto } from '../models/update-product-group.dto'

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
   * @param createProductGroupDto stores the new product group data
   * @returns the created product group entity
   */
  public async create(
    requestUser: UserEntity,
    createProductGroupDto: CreateProductGroupDto
  ): Promise<ProductGroupEntity> {
    const { productId, shoppingCartId } = createProductGroupDto

    /* If there are no products or shopping carts with the passed id those
    services will throw "EntityNotFoundException", if the request
    user has no permission the "UserService" will throw "ForbiddenException" */

    const product = await this.productService.get(productId)
    const shoppingCart = await this.shoppingCartService.get(
      shoppingCartId,
      requestUser
    )

    return await new ProductGroupEntity({
      ...createProductGroupDto,
      product,
      shoppingCart
    }).save()
  }

  /**
   * Method that can get only one product group from
   * @param productGroupId stores the product group id
   * @param requestUser stores the logged user data
   * @param crudRequest stores the joins, filters, etc
   * @returns the found product group entity
   */
  public async get(
    productGroupId: number,
    crudRequest?: CrudRequest
  ): Promise<ProductGroupEntity> {
    let entity: ProductGroupEntity

    if (crudRequest) {
      entity = await super.getOne(crudRequest).catch(() => undefined)
    } else {
      entity = await ProductGroupEntity.findOne({ id: productGroupId })
    }

    if (!entity || !entity.isActive) {
      throw new EntityNotFoundException(productGroupId, ProductGroupEntity)
    }

    return entity
  }

  /**
   * Method that can change the data of some product group entity
   * @param productGroupId stores the product group id
   * @param updateProductGroupDto store the product group new data
   */
  public async update(
    productGroupId: number,
    updateProductGroupDto: UpdateProductGroupDto
  ): Promise<void> {
    const entity = await ProductGroupEntity.findOne({ id: productGroupId })

    if (!entity || !entity.isActive) {
      throw new EntityNotFoundException(productGroupId, ProductGroupEntity)
    }

    await ProductGroupEntity.update(
      { id: productGroupId },
      updateProductGroupDto
    )
  }

  /**
   * Method that can delete some product group entity
   * @param productGroupId stores the product group id
   */
  public async delete(productGroupId: number): Promise<void> {
    const entity = await ProductGroupEntity.findOne({ id: productGroupId })

    if (!entity || !entity.isActive) {
      throw new EntityNotFoundException(productGroupId, ProductGroupEntity)
    }

    await ProductGroupEntity.delete({ id: productGroupId })
  }

  /**
   * Method that can disables some product group
   * @param productGroupId stores the product group id
   * @param requestUser stores the logged user data
   */
  public async disable(productGroupId: number): Promise<void> {
    const entity = await ProductGroupEntity.findOne({ id: productGroupId })

    if (!entity) {
      throw new EntityNotFoundException(productGroupId, ProductGroupEntity)
    }

    if (!entity.isActive) {
      throw new EntityAlreadyDisabledException(
        productGroupId,
        ProductGroupEntity
      )
    }

    await ProductGroupEntity.update({ id: productGroupId }, { isActive: false })
  }

  /**
   * Method that can enables some product group
   * @param productGroupId stores the product group id
   * @param requestUser stores the logged user data
   */
  public async enable(productGroupId: number): Promise<void> {
    const entity = await ProductGroupEntity.findOne({ id: productGroupId })

    if (!entity) {
      throw new EntityNotFoundException(productGroupId, ProductGroupEntity)
    }

    if (entity.isActive) {
      throw new EntityAlreadyEnabledException(
        productGroupId,
        ProductGroupEntity
      )
    }

    await ProductGroupEntity.update({ id: productGroupId }, { isActive: true })
  }
}
