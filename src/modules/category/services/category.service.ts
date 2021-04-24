import {
  ConflictException,
  forwardRef,
  Inject,
  Injectable,
  NotFoundException
} from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { CrudRequest, GetManyDefaultResponse } from '@nestjsx/crud'
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm'
import { Repository } from 'typeorm'

import { EntityNotFoundException } from 'src/exceptions/not-found/entity-not-found.exception'
import { CategoryEntity } from 'src/modules/category/entities/category.entity'
import { ProductEntity } from 'src/modules/product/entities/product.entity'

import { CreateCategoryDto } from '../models/create-category.dto'
import { UpdatedCategoryDto } from '../models/update-category.dto'

import { ProductService } from 'src/modules/product/services/product.service'
import { UserService } from 'src/modules/user/services/user.service'

/**
 * The app's main category service class
 *
 * Class that deals with the category data
 */
@Injectable()
export class CategoryService extends TypeOrmCrudService<CategoryEntity> {
  public constructor(
    @InjectRepository(CategoryEntity)
    private readonly repository: Repository<CategoryEntity>,
    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService,
    @Inject(forwardRef(() => ProductService))
    private readonly productService: ProductService
  ) {
    super(repository)
  }

  /**
   * Method that can save some entity in the database
   * @param createCategoryDto stores the new category data
   * @returns the created category
   */
  public async create(
    createCategoryDto: CreateCategoryDto
  ): Promise<CategoryEntity> {
    const entity = new CategoryEntity({
      ...createCategoryDto
    })

    return await entity.save()
  }

  /**
   * Method that can get one category entity
   * @param categoryId stores the category id
   * @param crudRequest stores the joins, filters, etc
   * @returns the found category entity
   */
  public async get(
    categoryId: number,
    crudRequest?: CrudRequest
  ): Promise<CategoryEntity> {
    const entity: CategoryEntity = crudRequest
      ? await super.getOne(crudRequest).catch(() => undefined)
      : await CategoryEntity.findOne({ id: categoryId })

    if (!entity || !entity.isActive) {
      throw new NotFoundException(
        `The entity identified by "${categoryId}" does not exist or is disabled`
      )
    }
    return entity
  }

  /**
   * Method that can get some category entities
   * @param crudRequest stores the joins, filters, etc
   * @returns the found category entities
   */
  public async getMore(
    crudRequest?: CrudRequest
  ): Promise<GetManyDefaultResponse<CategoryEntity> | CategoryEntity[]> {
    return await super.getMany(crudRequest)
  }

  /**
   * Method that can get all the products related to some category
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

  /**
   * Method that can update some category
   * @param categoryId stores the category id
   * @param updateCategoryPayload stores the new category data
   */
  public async update(
    categoryId: number,
    updateCategoryPayload: UpdatedCategoryDto
  ): Promise<void> {
    const entity = await CategoryEntity.findOne({ id: categoryId })

    if (!entity || !entity.isActive) {
      throw new NotFoundException(
        `The entity identified by "${categoryId}" does not exist or is disabled`
      )
    }

    await CategoryEntity.update({ id: categoryId }, updateCategoryPayload)
  }

  /**
   * Method that can delete some category
   * @param categoryId stores the category id
   */
  public async delete(categoryId: number): Promise<void> {
    const entity = await CategoryEntity.findOne({ id: categoryId })

    if (!entity || !entity.isActive) {
      throw new NotFoundException(
        `The entity identified by "${categoryId}" does not exist or is disabled`
      )
    }

    await CategoryEntity.delete({ id: categoryId })
  }

  /**
   * Method that can disable some category
   * @param categoryId stores the category id
   */
  public async disable(categoryId: number): Promise<void> {
    const entity = await CategoryEntity.findOne({ id: categoryId })

    if (!entity) {
      throw new NotFoundException(
        `The entity identified by "${categoryId}" does not exist or is disabled`
      )
    }

    if (!entity.isActive) {
      throw new ConflictException(
        `The entity identified by "${categoryId}" is already disabled`
      )
    }

    await CategoryEntity.update({ id: categoryId }, { isActive: false })
  }

  /**
   * Method that can enable some category
   * @param categoryId stores the category id
   */
  public async enable(categoryId: number): Promise<void> {
    const entity = await CategoryEntity.findOne({ id: categoryId })

    if (!entity) {
      throw new NotFoundException(
        `The entity identified by "${categoryId}" does not exist or is disabled`
      )
    }

    if (entity.isActive) {
      throw new ConflictException(
        `The entity identified by "${categoryId}" is already enabled`
      )
    }

    await CategoryEntity.update({ id: categoryId }, { isActive: true })
  }
}
