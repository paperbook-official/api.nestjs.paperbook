import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
  UseInterceptors
} from '@nestjs/common'
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

import { CreateProductCategoryDto } from '../models/create-product-category.dto'
import { ProductCategoryDto } from '../models/product-category.dto'
import { UpdateProductCategoryDto } from '../models/update-product-category.dto'

import { ProductCategoryService } from '../services/product-category.service'

import { map } from 'src/utils/crud'

import { RolesEnum } from 'src/models/enums/roles.enum'

/**
 * The app's main products controller class
 *
 * Class that deals with the products routes
 */
@Crud({
  model: {
    type: ProductCategoryDto
  },
  query: {
    persist: ['id', 'isActive'],
    filter: [{ field: 'isActive', operator: '$eq', value: true }],
    join: {
      product: {},
      category: {}
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
@ApiTags('products-categories')
@Controller('products-categories')
export class ProductCategoryController {
  public constructor(
    private readonly productCategoryService: ProductCategoryService
  ) {}

  /**
   * Method that is called when the user access the "/products-categories"
   * route with the "POST" method
   * @param createProductCategoryPayload stores the product-category new data
   * @returns the created product-category entity dto
   */
  @ApiOperation({ summary: 'Creates a new product-category relation' })
  @ApiCreatedResponse({
    description: 'Gets the created product-category data',
    type: ProductCategoryDto
  })
  @ProtectTo(RolesEnum.Admin)
  @Post()
  public async create(
    @Body() createProductCategoryPayload: CreateProductCategoryDto
  ): Promise<ProductCategoryDto> {
    const entity = await this.productCategoryService.create(
      createProductCategoryPayload
    )
    return entity.toDto()
  }

  /**
   * Method that is called when the user acces the "/products-categories/:id"
   * route with the "GET" method
   * @param productCategoryId stores the product-category id
   * @param crudRequest stores the joins, filters, etc
   * @returns the found entity dto
   */
  @ApiOperation({ summary: 'Gets the product-category' })
  @ApiOkResponse({
    description: 'Gets the created product-category data',
    type: ProductCategoryDto
  })
  @ProtectTo(RolesEnum.Admin)
  @Get(':id')
  public async get(
    @Param('id') productCategoryId: number,
    @ParsedRequest() crudRequest?: CrudRequest
  ): Promise<ProductCategoryDto> {
    const entity = await this.productCategoryService.get(
      productCategoryId,
      crudRequest
    )
    return entity.toDto()
  }

  /**
   * Method that is called when the user access the "/products-categories"
   * route with the "GET" method
   * @returns all the found product-category entity dto
   */
  @ProtectTo(RolesEnum.Admin)
  @Get()
  public async getMore(
    @ParsedRequest() crudRequest?: CrudRequest
  ): Promise<
    GetManyDefaultResponse<ProductCategoryDto> | ProductCategoryDto[]
  > {
    const entities = await this.productCategoryService.getMany(crudRequest)
    return map(entities, entity => entity.toDto())
  }

  /**
   * Method that is called when the user access the "/products-categories/:id"
   * route with the "PATCH" method
   * @param productCategoryId stores the product-category id
   * @param updateProductCategoryPayload stores the product-category entity new data
   */
  @ApiOperation({ summary: 'Updates a single product-category' })
  @ApiOkResponse({ description: 'Updates a single product-category' })
  @ProtectTo(RolesEnum.Admin)
  @Patch(':id')
  public async update(
    @Param('id') productCategoryId: number,
    @Body() updateProductCategoryPayload: UpdateProductCategoryDto
  ): Promise<void> {
    await this.productCategoryService.update(
      productCategoryId,
      updateProductCategoryPayload
    )
  }

  /**
   * Method that is called when the user access the "/products-categories/:id"
   * route with the "DELETE" method
   * @param productCategoryId stores the product-category id
   */
  @ProtectTo(RolesEnum.Admin)
  @Delete(':id')
  public async delete(@Param('id') productCategoryId: number): Promise<void> {
    await this.productCategoryService.delete(productCategoryId)
  }

  /**
   * Method that is called when the user access the "/products-category/:id/disable"
   * route with the "PUT" method
   * @param productCategoryId stores the product-category id
   */
  @ApiOperation({ summary: 'Disables a single product-category' })
  @ApiOkResponse({ description: 'Disables a single product-category' })
  @ProtectTo(RolesEnum.Admin)
  @Put(':id/disable')
  public async disable(@Param('id') productCategoryId: number): Promise<void> {
    await this.productCategoryService.disable(productCategoryId)
  }

  /**
   * Method that is called when the user access the "/products-category/:id/enable"
   * route with the "PUT" method
   * @param productCategoryId stores the product-category id
   */
  @ApiOperation({ summary: 'Enables a single product-category' })
  @ApiOkResponse({ description: 'Enables a single product-category' })
  @ProtectTo(RolesEnum.Admin)
  @Put(':id/enable')
  public async enable(@Param('id') productCategoryId: number): Promise<void> {
    await this.productCategoryService.enable(productCategoryId)
  }
}
