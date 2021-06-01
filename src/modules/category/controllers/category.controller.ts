import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  UseInterceptors
} from '@nestjs/common'
import { Patch } from '@nestjs/common'
import { Delete } from '@nestjs/common'
import {
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags
} from '@nestjs/swagger'
import {
  Crud,
  CrudRequest,
  CrudRequestInterceptor,
  GetManyDefaultResponse,
  ParsedRequest
} from '@nestjsx/crud'

import { ApiPropertyGetManyDefaultResponse } from 'src/decorators/api-property-get-many/api-property-get-many.decorator'
import { ApiPropertyGet } from 'src/decorators/api-property-get/api-property-get.decorator'
import { ProtectTo } from 'src/decorators/protect-to/protect-to.decorator'

import { CategoryDto, GetManyCategoryDtoResponse } from '../models/category.dto'
import { CreateCategoryDto } from '../models/create-category.dto'
import { UpdatedCategoryDto } from '../models/update-category.dto'
import { RolesEnum } from 'src/models/enums/roles.enum'

import { CategoryService } from '../services/category.service'

import { map } from 'src/utils/crud'

/**
 * The app's main category controller class
 *
 * Class that deals with the category routes
 */
@Crud({
  model: {
    type: CategoryDto
  },
  query: {
    persist: ['id', 'isActive'],
    filter: [{ field: 'isActive', operator: '$eq', value: true }],
    join: {
      products: {}
    }
  },
  routes: {
    exclude: [
      'createManyBase',
      'createOneBase',
      'updateOneBase',
      'replaceOneBase',
      'recoverOneBase',
      'getOneBase',
      'deleteOneBase'
    ]
  }
})
@UseInterceptors(CrudRequestInterceptor)
@ApiTags('categories')
@Controller('categories')
export class CategoryController {
  public constructor(private readonly categoryService: CategoryService) {}

  /**
   * Method that is called when the user access the "/category"
   * route with "POST" method
   *
   * @param createCategoryPayload stores the new category data
   * @returns the created category data
   */
  @ProtectTo(RolesEnum.Admin)
  @ApiOperation({ summary: 'Creates a new category' })
  @ApiCreatedResponse({
    description: 'Gets the created category data',
    type: CategoryDto
  })
  @ApiForbiddenResponse({
    description: 'The user has no permission to access those sources'
  })
  @Post()
  public async create(
    @Body() createCategoryPayload: CreateCategoryDto
  ): Promise<CategoryDto> {
    const entity = await this.categoryService.create(createCategoryPayload)
    return entity.toDto()
  }

  /**
   * Method that is called when the user access the "/category" route
   * with "GET" method
   *
   * @param crudRequest stores the joins, filters, etc
   * @returns the found category entity dtos
   */
  @ApiPropertyGetManyDefaultResponse()
  @ApiOperation({ summary: 'Retrieves multiple CategoryDto' })
  @ApiOkResponse({
    description: 'Get many base response',
    type: GetManyCategoryDtoResponse
  })
  @Get()
  public async listMany(
    @ParsedRequest() crudRequest?: CrudRequest
  ): Promise<GetManyDefaultResponse<CategoryDto> | CategoryDto[]> {
    const entities = await this.categoryService.listMany(crudRequest)
    return map(entities, entity => entity.toDto())
  }

  /**
   * Method that is called when the user access the "/category/:id"
   * route with "GET" method
   *
   * @param categoryId stores the target category id
   * @param crudRequest stores the joins, filters, etc
   * @returns the found category entity dto
   */
  @ApiPropertyGet()
  @ApiOperation({ summary: 'Retrieve a single CategoryDto' })
  @ApiOkResponse({
    description: 'Retrieve a single CategoryDto',
    type: CategoryDto
  })
  @ApiNotFoundResponse({ description: 'Category not found' })
  @Get(':id')
  public async list(
    @Param('id') categoryId: number,
    @ParsedRequest() crudRequest?: CrudRequest
  ): Promise<CategoryDto> {
    const entity = await this.categoryService.list(categoryId, crudRequest)
    return entity.toDto()
  }

  /**
   * Method that is called when the user access the "/category/:id"
   * route with "PATCH"
   *
   * @param categoryId stores the target category id
   * @param updatedCategoryDto stores the new category data
   * @throws {EntityNotFoundException} if the category was not found
   */
  @ProtectTo(RolesEnum.Admin)
  @ApiOperation({ summary: 'Updates a single category' })
  @ApiOkResponse({ description: 'Updates user' })
  @ApiNotFoundResponse({ description: 'Category not found' })
  @Patch(':id')
  public async update(
    @Param('id') categoryId: number,
    @Body() updatedCategoryDto: UpdatedCategoryDto
  ): Promise<void> {
    await this.categoryService.update(categoryId, updatedCategoryDto)
  }

  /**
   * Method that is called when the user access the "/category/:id"
   * route with "DELETE" method
   *
   * @param categoryId stores the target user id
   * @throws {EntityNotFoundException} if the category was not found
   * @throws {ForbiddenException} if the request user has no permission
   * to access those sources
   */
  @ProtectTo(RolesEnum.Admin)
  @ApiOperation({ summary: 'Delete a single category' })
  @ApiOkResponse({ description: 'Delete one base response' })
  @ApiNotFoundResponse({ description: 'Category not found' })
  @ApiForbiddenResponse({
    description: 'The user has no permission to access those sources'
  })
  @Delete(':id')
  public async delete(@Param('id') categoryId: number): Promise<void> {
    await this.categoryService.delete(categoryId)
  }

  /**
   * Method that is called when the user access the "category/:id/disable"
   * route with "PUT" method
   *
   * @param categoryId stores the target category id
   * @throws {EntityNotFoundException} if the category was not found
   * @throws {ForbiddenException} if the request user has no permission
   * to access those sources
   * @throws {EntityAlreadyDisabledException} if the category is already disabled
   */
  @ProtectTo(RolesEnum.Admin)
  @ApiOperation({ summary: 'Disables a single category' })
  @ApiOkResponse({ description: 'Disables a single category' })
  @ApiNotFoundResponse({ description: 'Category not found' })
  @ApiForbiddenResponse({
    description: 'The category has no permission to access those sources'
  })
  @ApiConflictResponse({ description: 'The user is already disabled' })
  @Put(':id/disable')
  public async disable(@Param('id') categoryId: number): Promise<void> {
    await this.categoryService.disable(categoryId)
  }

  /**
   * Method that is called when the user access the "category/:id/enable"
   * route with "PUT" method
   *
   * @param categoryId stores the target category id
   * @throws {EntityNotFoundException} if the category was not found
   * @throws {ForbiddenException} if the request user has no permission
   * to access those sources
   * @throws {EntityAlreadyEnabledException} if the category is already enabled
   */
  @ProtectTo(RolesEnum.Admin)
  @ApiOperation({ summary: 'Enables a single category' })
  @ApiOkResponse({ description: 'Enables a single category' })
  @ApiNotFoundResponse({ description: 'Category not found' })
  @ApiForbiddenResponse({
    description: 'The user has no permission to access those sources'
  })
  @ApiConflictResponse({ description: 'The category is already enabled' })
  @Put(':id/enable')
  public async enable(@Param('id') categoryId: number): Promise<void> {
    await this.categoryService.enable(categoryId)
  }
}
