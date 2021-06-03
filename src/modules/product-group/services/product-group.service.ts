import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { CrudRequest } from '@nestjsx/crud'
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm'
import { Repository } from 'typeorm'

import { EntityAlreadyDisabledException } from 'src/exceptions/conflict/entity-already-disabled.exception'
import { EntityAlreadyEnabledException } from 'src/exceptions/conflict/entity-already-enabled.exception'
import { EntityNotFoundException } from 'src/exceptions/not-found/entity-not-found.exception'

import { ProductEntity } from '../../product/entities/product.entity'
import { ShoppingCartEntity } from '../../shopping-cart/entities/shopping-cart.entity'
import { ProductGroupEntity } from '../entities/product-group.entity'

import { CreateProductGroupDto } from '../models/create-product-group.dto'
import { UpdateProductGroupDto } from '../models/update-product-group.dto'

/**
 * The app's main product group service class
 *
 * Class that deals with the product group data
 */
@Injectable()
export class ProductGroupService extends TypeOrmCrudService<
  ProductGroupEntity
> {
  public constructor(
    @InjectRepository(ProductGroupEntity)
    repository: Repository<ProductGroupEntity>,
  ) {
    super(repository)
  }

  /**
   * Method that can create a new product group entity
   *
   * @param createProductGroupDto stores the new product group data
   * @throws {EntityNotFoundException} if the product was not found
   * @throws {EntityNotFoundException} if the shopping cart was not found
   * @returns the created product group entity
   */
  public async create(
    createProductGroupDto: CreateProductGroupDto,
  ): Promise<ProductGroupEntity> {
    const { productId, shoppingCartId } = createProductGroupDto

    const product = await ProductEntity.findOne({ id: productId })
    const shoppingCart = await ShoppingCartEntity.findOne({
      id: shoppingCartId,
    })

    if (!product || !product.isActive) {
      throw new EntityNotFoundException(productId, ProductEntity)
    }

    if (!shoppingCart || !shoppingCart.isActive) {
      throw new EntityNotFoundException(shoppingCartId, ShoppingCartEntity)
    }

    return await new ProductGroupEntity({
      ...createProductGroupDto,
      product,
      shoppingCart,
    }).save()
  }

  /**
   * Method that can get only one product group from
   *
   * @param productGroupId stores the product group id
   * @param crudRequest stores the joins, filters, etc
   * @throws {EntityNotFoundException} if the product group was not found
   * @returns the found product group entity
   */
  public async listOne(
    productGroupId: number,
    crudRequest?: CrudRequest,
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
   *
   * @param productGroupId stores the product group id
   * @param updateProductGroupDto store the product group new data
   * @throws {EntityNotFoundException} if the product group was not found
   */
  public async update(
    productGroupId: number,
    updateProductGroupDto: UpdateProductGroupDto,
  ): Promise<void> {
    const entity = await ProductGroupEntity.findOne({ id: productGroupId })

    if (!entity || !entity.isActive) {
      throw new EntityNotFoundException(productGroupId, ProductGroupEntity)
    }

    await ProductGroupEntity.update(
      { id: productGroupId },
      updateProductGroupDto,
    )
  }

  /**
   * Method that can delete some product group entity
   *
   * @param productGroupId stores the product group id
   * @throws {EntityNotFoundException} if the product group was not found
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
   *
   * @param productGroupId stores the product group id
   * @throws {EntityNotFoundException} if the product group was not found
   * @throws {EntityAlreadyDisabledException} if the product group entity is already disabled
   */
  public async disable(productGroupId: number): Promise<void> {
    const entity = await ProductGroupEntity.findOne({ id: productGroupId })

    if (!entity) {
      throw new EntityNotFoundException(productGroupId, ProductGroupEntity)
    }

    if (!entity.isActive) {
      throw new EntityAlreadyDisabledException(
        productGroupId,
        ProductGroupEntity,
      )
    }

    await ProductGroupEntity.update({ id: productGroupId }, { isActive: false })
  }

  /**
   * Method that can enables some product group
   *
   * @param productGroupId stores the product group id
   * @throws {EntityNotFoundException} if the product group was not found
   * @throws {EntityAlreadyEnabledException} if the product group entity is already enabled
   */
  public async enable(productGroupId: number): Promise<void> {
    const entity = await ProductGroupEntity.findOne({ id: productGroupId })

    if (!entity) {
      throw new EntityNotFoundException(productGroupId, ProductGroupEntity)
    }

    if (entity.isActive) {
      throw new EntityAlreadyEnabledException(
        productGroupId,
        ProductGroupEntity,
      )
    }

    await ProductGroupEntity.update({ id: productGroupId }, { isActive: true })
  }
}
