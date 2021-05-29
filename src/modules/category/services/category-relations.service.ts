import { Injectable, Inject, forwardRef } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { CrudRequest, GetManyDefaultResponse } from '@nestjsx/crud'
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm'
import { Repository } from 'typeorm'

import { CategoryEntity } from '../entities/category.entity'
import { EntityNotFoundException } from 'src/exceptions/not-found/entity-not-found.exception'
import { ProductEntity } from 'src/modules/product/entities/product.entity'

import { ProductService } from 'src/modules/product/services/product.service'

/**
 * The app's main category relations service class
 *
 * Class that deals with the category relations data
 */
@Injectable()
export class CategoryRelationsService extends TypeOrmCrudService<
  CategoryEntity
> {
  public constructor(
    @InjectRepository(CategoryEntity)
    repository: Repository<CategoryEntity>,
    @Inject(forwardRef(() => ProductService))
    private readonly productService: ProductService
  ) {
    super(repository)
  }

  /**
   * Method that can get all the products related to some category
   *
   * @param categoryId store the category id
   * @param crudRequest stores the joins, filters, etc
   * @returns all the found products
   */
  public async getProductsByCategoryId(
    categoryId: number,
    crudRequest?: CrudRequest
  ): Promise<GetManyDefaultResponse<ProductEntity> | ProductEntity[]> {
    const entity = await CategoryEntity.findOne({ id: categoryId })

    if (!entity || !entity.isActive) {
      throw new EntityNotFoundException(categoryId, CategoryEntity)
    }

    crudRequest.parsed.paramsFilter = []
    crudRequest.parsed.join = [
      ...crudRequest.parsed.join,
      {
        field: 'categories',
        select: ['id']
      }
    ]
    crudRequest.parsed.search.$and = [
      ...crudRequest.parsed.search.$and,
      {
        'categories.id': { $eq: categoryId }
      }
    ]

    return await this.productService.getMany(crudRequest)
  }
}
