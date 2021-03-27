import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { CrudRequest } from '@nestjsx/crud'
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm'
import { Repository } from 'typeorm'

import { ProductCategoryEntity } from '../entities/product-category.entity'
import { EntityNotFoundException } from 'src/exceptions/not-found/entity-not-found.exception'

import { CreateProductCategoryPayload } from '../models/create-product-category.payload'
import { UpdateProductCategoryPayload } from '../models/update-product-category.payload'

import { CategoryService } from 'src/modules/category/services/category.service'
import { ProductService } from 'src/modules/product/services/product.service'

/**
 * The app's main product category service class
 *
 * Class that deals with the products category data
 */
@Injectable()
export class ProductCategoryService extends TypeOrmCrudService<
  ProductCategoryEntity
> {
  public constructor(
    @InjectRepository(ProductCategoryEntity)
    private readonly repository: Repository<ProductCategoryEntity>,
    private readonly productService: ProductService,
    private readonly categoryService: CategoryService
  ) {
    super(repository)
  }

  /**
   * Method that can create a new product-category entity
   * @param createProductCategoryPayload stores the new product-category
   * entity data
   * @returns the new product-category entity
   */
  public async create(
    createProductCategoryPayload: CreateProductCategoryPayload
  ): Promise<ProductCategoryEntity> {
    const { productId, categoryId } = createProductCategoryPayload

    /* if there is not product or category those methods will
    call a "NotFoundEntityException" */

    const product = await this.productService.get(productId)
    const category = await this.categoryService.get(categoryId)

    return await new ProductCategoryEntity({
      ...createProductCategoryPayload,
      product,
      category
    }).save()
  }

  /**
   * Method that can get only one product category entity
   * @param productCategoryId stores the product category id
   * @param crudRequest stores the joins, filter, etc
   * @returns the product category entity
   */
  public async get(
    productCategoryId: number,
    crudRequest?: CrudRequest
  ): Promise<ProductCategoryEntity> {
    let entity: ProductCategoryEntity

    if (crudRequest) {
      entity = await super.getOne(crudRequest).catch(() => undefined)
    } else {
      entity = await ProductCategoryEntity.findOne({ id: productCategoryId })
    }

    if (!entity || !entity.isActive) {
      throw new EntityNotFoundException(
        productCategoryId,
        ProductCategoryEntity
      )
    }

    return entity
  }

  /**
   * Method that can change data of some product-category entity
   * @param productCategoryId stores the product-category id
   * @param updateProductCategoryPayload stores the product-category new data
   */
  public async update(
    productCategoryId: number,
    updateProductCategoryPayload: UpdateProductCategoryPayload
  ): Promise<void> {
    const entity = await ProductCategoryEntity.findOne({
      id: productCategoryId
    })

    if (!entity || !entity.isActive) {
      throw new EntityNotFoundException(
        productCategoryId,
        ProductCategoryEntity
      )
    }

    await ProductCategoryEntity.update(
      { id: productCategoryId },
      updateProductCategoryPayload
    )
  }
}
