import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
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

import { Roles } from 'src/decorators/roles/roles.decorator'

import { JwtGuard } from 'src/guards/jwt/jwt.guard'
import { RolesGuard } from 'src/guards/roles/roles.guard'

import { CategoryEntity } from '../entities/category.entity'

import { CategoryProxy } from '../models/category.proxy'
import { CreateCategoryPayload } from '../models/create-category.payload'
import { UpdatedCategoryPayload } from '../models/update-category.payload'

import { CategoryService } from '../services/category.service'

import { mapCrud } from 'src/utils/crud'

import { RolesEnum } from 'src/models/enums/roles.enum'


@Crud({
  model: {
    type: CategoryEntity
  },
  query: {
    persist: ['id', 'isActive'],
    filter: [{ field: 'isActive', operator: '$eq', value: true }]
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
   * Method that is called when the user access the "/Category"
   * route with "POST" method
   * @param requestUser stores the logged user data
   * @param createCategoryPayload stores the new Category data
   * @returns the created Category data
   */
  @ApiOperation({ summary: 'Creates a new category' })
  @ApiCreatedResponse({
    description: 'Gets the created category data',
    type: CategoryProxy
  })
  @Roles(RolesEnum.Admin)
  @UseGuards(JwtGuard, RolesGuard)
  @Post()
  public async create(
    @Body() createCategoryPayload: CreateCategoryPayload
  ): Promise<CategoryProxy> {
    const entity = await this.categoryService.create(
      createCategoryPayload
    )
    return entity.toProxy()
  }

  /**
   * Method that is called when the user access the "/category/:id"
   * route with "GET" method
   * @param categoryId stores the target category id
   * @param crudRequest stores the joins, filters, etc
   * @returns the found category data
   */
  @Get(':id')
  public async get(
    @Param('id') categoryId: number,
    @ParsedRequest() crudRequest?: CrudRequest
  ): Promise<CategoryProxy> {
    const entity = await this.categoryService.get(
      categoryId,
      crudRequest
    )
    return entity.toProxy()
  }

  /**
   * Method that is called when the user access the "/category" route
   * with "GET" method
   * @param crudRequest stores the joins, filters, etc
   * @returns the found category data
   */
  @Get()
  public async getMore(
    @ParsedRequest() crudRequest: CrudRequest
  ): Promise<GetManyDefaultResponse<CategoryProxy> | CategoryProxy[]> {
    const entities = await this.categoryService.getMore(crudRequest)
    return mapCrud(entities)
  }

  /**
   * Method that is called when the user access the "/category/:id"
   * route with "PATCH"
   * @param categoryId stores the target category id
   * @param requestUser stores the logged user data
   * @param updatedUserPayload stores the new user data
   */
  @ApiOperation({ summary: 'Updates a single category' })
  @ApiOkResponse({ description: 'Updates user' })
  @Roles(RolesEnum.Admin)
  @UseGuards(JwtGuard, RolesGuard)
  @Patch(':id')
  public async update(
    @Param('id') categoryId: number,
    @Body() updatedCategoryPayload: UpdatedCategoryPayload
  ): Promise<void> {
    await this.categoryService.update(
      categoryId,
      updatedCategoryPayload
    )
  }

  /**
   * Method that is called when the user acces the "/category/:id"
   * route with "DELETE" method
   * @param categoryId stores the target user id
   * @param requestUser stores the logged user data
   */
  @Roles(RolesEnum.Admin)
  @UseGuards(JwtGuard, RolesGuard)
  @Delete(':id')
  public async delete(
    @Param('id') categoryId: number,
  ): Promise<void> {
    await this.categoryService.delete(categoryId)
  }

  /**
   * Method that is called when the user acces the "category/:id/disable"
   * route with "PUT" method
   * @param categoryId stores the target category id
   * @param requestUser stores the logged user data
   */
  @ApiOperation({ summary: 'Disables a single category' })
  @ApiOkResponse({ description: 'Disables a single category' })
  @Roles(RolesEnum.Admin)
  @UseGuards(JwtGuard, RolesGuard)
  @Put(':id/disable')
  public async disable(
    @Param('id') categoryId: number,
  ): Promise<void> {
    await this.categoryService.disable(categoryId)
  }

  /**
   * Method that is called when the user acces the "category/:id/enable"
   * route with "PUT" method
   * @param categoryId stores the target category id
   */
  @ApiOperation({ summary: 'Enables a single category' })
  @ApiOkResponse({ description: 'Enables a single category' })
  @Roles(RolesEnum.Admin)
  @UseGuards(JwtGuard, RolesGuard)
  @Put(':id/enable')
  public async enable(
    @Param('id') categoryId: number,
  ): Promise<void> {
    await this.categoryService.enable(categoryId)
  }
}