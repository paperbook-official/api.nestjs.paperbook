import {
  ConflictException,
  ForbiddenException,
  Injectable
} from '@nestjs/common'
import { NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { CrudRequest, GetManyDefaultResponse } from '@nestjsx/crud'
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm'
import { Repository } from 'typeorm'

import { CategoryEntity } from 'src/modules/category/entities/category.entity'

import { UpdatedCategoryPayload } from '../models/update-category.payload'
import { CreateCategoryPayload } from 'src/modules/category/models/create-category.payload'

import { UserService } from 'src/modules/user/services/user.service'

import { isGetMany } from 'src/utils/crud'
import { RequestUser } from 'src/utils/type.shared'

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
    private readonly userService: UserService
  ) {
    super(repository)
  }

  /**
   * Method that can save some entity in the database
   * @param requestUser stores the logged user data
   * @param createCategoryPayload stores the new category data
   * @returns the created category
   */
  public async create(
    createCategoryPayload: CreateCategoryPayload
  ): Promise<CategoryEntity> {

    const entity = new CategoryEntity({
      ...createCategoryPayload,
    })

    return await entity.save()
  }

  /**
   * Method that can get one category entity
   * @param categoryId stores the category id
   * @param requestUser stores the logged user data
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
    const entities = await super.getMany(crudRequest)
    return entities
  }

  /**
   * Method that can update some category
   * @param categoryId stores the category id
   * @param requestUser stores the logged user data
   * @param updateCategoryPayload stores the new category data
   */
  public async update(
    categoryId: number,
    updateCategoryPayload: UpdatedCategoryPayload
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
  public async delete(
    categoryId: number,
  ): Promise<void> {
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
  public async disable(
    categoryId: number,
  ): Promise<void> {
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
  public async enable(
    categoryId: number,
  ): Promise<void> {
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