import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm'
import { Repository } from 'typeorm'

import { ProductCategoryEntity } from '../entities/product-category.entity'

import { CreateProductCategoryPayload } from '../models/create-product-category.payload'

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
}
