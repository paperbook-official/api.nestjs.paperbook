import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
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
import { User } from 'src/decorators/user/user.decorator'

import { CreateProductPaylaod } from '../models/create-product.payload'
import { ProductProxy } from '../models/product.proxy'
import { UpdateProductPayload } from '../models/update-product.payload'

import { ProductService } from '../services/product.service'

import { mapCrud } from 'src/utils/crud'
import { RequestUser } from 'src/utils/type.shared'

import { RolesEnum } from 'src/models/enums/roles.enum'

/**
 * The app's main products controller class
 *
 * Class that deals with the products routes
 */
@Crud({
  model: {
    type: ProductProxy
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
@ApiTags('products')
@Controller('products')
export class ProductController {
  public constructor(private readonly productService: ProductService) {}

  /**
   * Method that is called when the user access the "/products"
   * route with "POST" method
   * @param requestUser stores the logged user data
   * @param createProductPaylaod stores the new product data
   * @returns the created product data
   */
  @ApiOperation({ summary: 'Creates a new ' })
  @ApiCreatedResponse({
    description: 'Gets the created product data',
    type: ProductProxy
  })
  @ProtectTo(RolesEnum.Admin, RolesEnum.Seller)
  @Post()
  public async create(
    @User() requestUser: RequestUser,
    @Body() createProductPaylaod: CreateProductPaylaod
  ): Promise<ProductProxy> {
    const entity = await this.productService.create(
      requestUser,
      createProductPaylaod
    )
    return entity.toProxy()
  }

  /**
   * Method that is called when the user access the "/products/:id"
   * route with "GET" method
   * @param productId stores the product id
   * @param crudRequest store the joins, filters, etc
   * @returns the found entity
   */
  @Get(':id')
  public async get(
    @ParsedRequest() crudRequest?: CrudRequest
  ): Promise<ProductProxy> {
    const entity = await this.productService.getOne(crudRequest)
    return entity.toProxy()
  }

  /**
   * Method that is called when the user access the "/products" route
   * with the "GET" method
   * @param crudRequest stores the joins, filters, etc
   * @returns all the found entities
   */
  @Get()
  public async getMore(
    @ParsedRequest() crudRequest?: CrudRequest
  ): Promise<GetManyDefaultResponse<ProductProxy> | ProductProxy[]> {
    const entities = await this.productService.getMany(crudRequest)
    return mapCrud(entities)
  }

  /**
   * Method that is called when the user access the "/products/:id"
   * route with the "PATCH" method
   * @param productId stores the product id
   * @param requestUser stores the logged user data
   * @param updateProductPayload stores the new product data
   */
  @ApiOperation({ summary: 'Updates a single product' })
  @ApiOkResponse({ description: 'Updates  user' })
  @ProtectTo(RolesEnum.Seller, RolesEnum.Admin)
  @Patch(':id')
  public async update(
    @Param('id') productId: number,
    @User() requestUser: RequestUser,
    @Body() updateProductPayload: UpdateProductPayload
  ): Promise<void> {
    await this.productService.update(
      productId,
      requestUser,
      updateProductPayload
    )
  }
}
