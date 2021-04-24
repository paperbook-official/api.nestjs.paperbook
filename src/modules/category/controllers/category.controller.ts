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
  ApiCreatedResponse,
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

import { ProtectTo } from 'src/decorators/protect-to/protect-to.decorator'

import { CategoryDto } from '../models/category.dto'
import { CreateCategoryDto } from '../models/create-category.dto'
import { UpdatedCategoryDto } from '../models/update-category.dto'

import { CategoryService } from '../services/category.service'

import { map } from 'src/utils/crud'

import { RolesEnum } from 'src/models/enums/roles.enum'

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
      'replaceOneBase'
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
   * @param createCategoryPayload stores the new Category data
   * @returns the created Category data
   */
  @ApiOperation({ summary: 'Creates a new category' })
  @ApiCreatedResponse({
    description: 'Gets the created category data',
    type: CategoryDto
  })
  @ProtectTo(RolesEnum.Admin)
  @Post()
  public async create(
    @Body() createCategoryPayload: CreateCategoryDto
  ): Promise<CategoryDto> {
    const entity = await this.categoryService.create(createCategoryPayload)
    return entity.toDto()
  }

  /**
   * Method that is called when the user access the "/category/:id"
   * route with "GET" method
   * @param categoryId stores the target category id
   * @param crudRequest stores the joins, filters, etc
   * @returns the found category entity dto
   */
  @Get(':id')
  public async get(
    @Param('id') categoryId: number,
    @ParsedRequest() crudRequest?: CrudRequest
  ): Promise<CategoryDto> {
    const entity = await this.categoryService.get(categoryId, crudRequest)
    return entity.toDto()
  }

  /**
   * Method that is called when the user access the "/category" route
   * with "GET" method
   * @param crudRequest stores the joins, filters, etc
   * @returns the found category entity dtos
   */
  @Get()
  public async getMore(
    @ParsedRequest() crudRequest: CrudRequest
  ): Promise<GetManyDefaultResponse<CategoryDto> | CategoryDto[]> {
    const entities = await this.categoryService.getMore(crudRequest)
    return map(entities, entity => entity.toDto())
  }

  /**
   * Method that is called when the user access the "/category/:id"
   * route with "PATCH"
   * @param categoryId stores the target category id
   * @param updatedCategoryDto stores the new category data
   */
  @ApiOperation({ summary: 'Updates a single category' })
  @ApiOkResponse({ description: 'Updates user' })
  @ProtectTo(RolesEnum.Admin)
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
   * @param categoryId stores the target user id
   */
  @ProtectTo(RolesEnum.Admin)
  @Delete(':id')
  public async delete(@Param('id') categoryId: number): Promise<void> {
    await this.categoryService.delete(categoryId)
  }

  /**
   * Method that is called when the user access the "category/:id/disable"
   * route with "PUT" method
   * @param categoryId stores the target category id
   */
  @ApiOperation({ summary: 'Disables a single category' })
  @ApiOkResponse({ description: 'Disables a single category' })
  @ProtectTo(RolesEnum.Admin)
  @Put(':id/disable')
  public async disable(@Param('id') categoryId: number): Promise<void> {
    await this.categoryService.disable(categoryId)
  }

  /**
   * Method that is called when the user access the "category/:id/enable"
   * route with "PUT" method
   * @param categoryId stores the target category id
   */
  @ApiOperation({ summary: 'Enables a single category' })
  @ApiOkResponse({ description: 'Enables a single category' })
  @ProtectTo(RolesEnum.Admin)
  @Put(':id/enable')
  public async enable(@Param('id') categoryId: number): Promise<void> {
    await this.categoryService.enable(categoryId)
  }
}
