import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { CrudRequest, GetManyDefaultResponse } from '@nestjsx/crud'
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm'
import { Repository } from 'typeorm'

import { EntityAlreadyDisabledException } from 'src/exceptions/conflict/entity-already-disabled.exception'
import { EntityAlreadyEnabledException } from 'src/exceptions/conflict/entity-already-enabled.exception'
import { EntityNotFoundException } from 'src/exceptions/not-found/entity-not-found.exception'

import { CategoryEntity } from 'src/modules/category/entities/category.entity'

import { CreateCategoryDto } from '../models/create-category.dto'
import { UpdatedCategoryDto } from '../models/update-category.dto'

/**
 * The app's main category service class
 *
 * Class that deals with the category data
 */
@Injectable()
export class CategoryService extends TypeOrmCrudService<CategoryEntity> {
  public constructor(
    @InjectRepository(CategoryEntity)
    repository: Repository<CategoryEntity>,
  ) {
    super(repository)
  }

  /**
   * Method that can save some entity in the database
   *
   * @param createCategoryDto stores the new category data
   * @returns the created category
   */
  public async create(
    createCategoryDto: CreateCategoryDto,
  ): Promise<CategoryEntity> {
    return await new CategoryEntity({
      ...createCategoryDto,
    }).save()
  }

  /**
   * Method that can get some category entities
   *
   * @param crudRequest stores the joins, filters, etc
   * @returns the found category entities
   */
  public async listMany(
    crudRequest?: CrudRequest,
  ): Promise<GetManyDefaultResponse<CategoryEntity> | CategoryEntity[]> {
    return await super.getMany(crudRequest)
  }

  /**
   * Method that can get one category entity
   *
   * @param categoryId stores the category id
   * @param crudRequest stores the joins, filters, etc
   * @throws {EntityNotFoundException} if the category entity was not found
   * @returns the found category entity
   */
  public async listOne(
    categoryId: number,
    crudRequest?: CrudRequest,
  ): Promise<CategoryEntity> {
    const entity: CategoryEntity = crudRequest
      ? await super.getOne(crudRequest).catch(() => undefined)
      : await CategoryEntity.findOne({ id: categoryId })

    if (!entity || !entity.isActive) {
      throw new EntityNotFoundException(categoryId, CategoryEntity)
    }

    return entity
  }

  /**
   * Method that can update some category
   *
   * @param categoryId stores the category id
   * @param updateCategoryPayload stores the new category data
   * @throws {EntityNotFoundException} if the category entity was not found
   */
  public async update(
    categoryId: number,
    updateCategoryPayload: UpdatedCategoryDto,
  ): Promise<void> {
    const entity = await CategoryEntity.findOne({ id: categoryId })

    if (!entity || !entity.isActive) {
      throw new EntityNotFoundException(categoryId, CategoryEntity)
    }

    await CategoryEntity.update({ id: categoryId }, updateCategoryPayload)
  }

  /**
   * Method that can delete some category
   *
   * @param categoryId stores the category id
   * @throws {EntityNotFoundException} if the category entity was not found
   */
  public async delete(categoryId: number): Promise<void> {
    const entity = await CategoryEntity.findOne({ id: categoryId })

    if (!entity || !entity.isActive) {
      throw new EntityNotFoundException(categoryId, CategoryEntity)
    }

    await CategoryEntity.delete({ id: categoryId })
  }

  /**
   * Method that can disable some category
   *
   * @param categoryId stores the category id
   * @throws {EntityNotFoundException} if the category entity was not found
   * @throws {EntityAlreadyDisabledException} if the category entity is already disabled
   */
  public async disable(categoryId: number): Promise<void> {
    const entity = await CategoryEntity.findOne({ id: categoryId })

    if (!entity) {
      throw new EntityNotFoundException(categoryId, CategoryEntity)
    }

    if (!entity.isActive) {
      throw new EntityAlreadyDisabledException(categoryId, CategoryEntity)
    }

    await CategoryEntity.update({ id: categoryId }, { isActive: false })
  }

  /**
   * Method that can enable some category
   *
   * @param categoryId stores the category id
   * @throws {EntityNotFoundException} if the category entity was not found
   * @throws {EntityAlreadyEnabledException} if the category entity is already enabled
   */
  public async enable(categoryId: number): Promise<void> {
    const entity = await CategoryEntity.findOne({ id: categoryId })

    if (!entity) {
      throw new EntityNotFoundException(categoryId, CategoryEntity)
    }

    if (entity.isActive) {
      throw new EntityAlreadyEnabledException(categoryId, CategoryEntity)
    }

    await CategoryEntity.update({ id: categoryId }, { isActive: true })
  }
}
