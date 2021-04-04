import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Put,
  Query,
  UseInterceptors
} from '@nestjs/common'
import {
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
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
import { ProtectTo } from 'src/decorators/protect-to/protect-to.decorator'
import { User } from 'src/decorators/user/user.decorator'

import { CreateProductPaylaod } from '../models/create-product.payload'
import {
  GetManyProductProxyResponse,
  ProductProxy
} from '../models/product.proxy'
import { UpdateProductPayload } from '../models/update-product.payload'

import { ProductService } from '../services/product.service'

import { map } from 'src/utils/crud'
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
    filter: [{ field: 'isActive', operator: '$eq', value: true }],
    join: {
      rating: {},
      user: {},
      orders: {},
      productsCategories: {},
      shoppingCarts: {},
      ratings: {}
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
@ApiTags('products')
@Controller('products')
export class ProductController {
  public constructor(private readonly productService: ProductService) {}

  /**
   * Method that is called when the user access the "/products"
   * route with the "POST" method
   * @param requestUser stores the logged user data
   * @param createProductPaylaod stores the new product data
   * @returns the created product data
   */
  @ApiOperation({ summary: 'Creates a new product' })
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
   * Method that is called when the user access the "/products/less-than"
   * route with "GET" method passing the "maxPrice" query
   * @param maxPrice stores the max price value
   * @param crudRequest stores the filters, joins, etc
   * @returns all the found elements
   */
  @ApiOperation({
    summary: 'Retrieves all the products with price less than "maxPrice" value'
  })
  @ApiQuery({
    required: true,
    name: 'maxPrice',
    type: 'string',
    description:
      'Selects products with fullPrice parameter less than this value.'
  })
  @ApiPropertyGetManyDefaultResponse()
  @ApiOkResponse({
    description: 'Gets all the products with price less than "maxPrice" value',
    type: GetManyProductProxyResponse
  })
  @Get('less-than')
  public async getLessThan(
    @Query('maxPrice', ParseIntPipe) maxPrice: number,
    @ParsedRequest() crudRequest: CrudRequest
  ): Promise<GetManyDefaultResponse<ProductProxy> | ProductProxy[]> {
    const entities = await this.productService.getLessThan(
      maxPrice,
      crudRequest
    )
    return map(entities, entity => entity.toProxy())
  }

  /**
   * Method that is called when the user access the "/products/offers"
   * route with "GET" method
   * @param crudRequest stores the joins, filters, etc
   * @returns all the found products
   */
  @ApiOperation({
    summary: 'Retrieves all the products with discount greater than 0'
  })
  @ApiPropertyGetManyDefaultResponse()
  @ApiOkResponse({
    description: 'Gets all the products with discount greater than 0',
    type: GetManyProductProxyResponse
  })
  @Get('on-sale')
  public async getOnSale(
    @ParsedRequest() crudRequest?: CrudRequest
  ): Promise<GetManyDefaultResponse<ProductProxy> | ProductProxy[]> {
    const entities = await this.productService.getOnSale(crudRequest)
    return map(entities, entity => entity.toProxy())
  }

  /**
   * Method that is called when the user access the "/products/free-of-interests"
   * route with "GET" method
   * @param crudRequest stores the joins, filters, etc
   * @returns all the found products
   */
  @ApiOperation({
    summary: 'Retrieves all the products with no installment price'
  })
  @ApiPropertyGetManyDefaultResponse()
  @ApiOkResponse({
    description: 'Gets all the products with no installment price',
    type: GetManyProductProxyResponse
  })
  @Get('free-of-interests')
  public async getFreeOfInterests(
    @ParsedRequest() crudRequest?: CrudRequest
  ): Promise<GetManyDefaultResponse<ProductProxy> | ProductProxy[]> {
    const entities = await this.productService.getFreeOfInterests(crudRequest)
    return map(entities, entity => entity.toProxy())
  }

  /**
   * Method that is called when the user acces the "products/recents"
   * foute with "GET" method
   * @param crudRequest stores the joins, filter, etc
   * @returns all the found elements
   */
  @ApiOperation({
    summary: 'Retrieves all the products organized by "createdAt" field'
  })
  @ApiPropertyGetManyDefaultResponse()
  @ApiOkResponse({
    description: 'Gets all the products organized by "createdAt" field',
    type: GetManyProductProxyResponse
  })
  @Get('recents')
  public async getRecents(
    @ParsedRequest() crudRequest?: CrudRequest
  ): Promise<GetManyDefaultResponse<ProductProxy> | ProductProxy[]> {
    const entities = await this.productService.getFreeOfInterests(crudRequest)
    return map(entities, entity => entity.toProxy())
  }

  /**
   * Method that is called when the user access the "/products/:id"
   * route with the "GET" method
   * @param productId stores the product id
   * @param crudRequest store the joins, filters, etc
   * @returns the found entity
   */
  @Get(':id')
  public async get(
    @Param('id') productId: number,
    @ParsedRequest() crudRequest?: CrudRequest
  ): Promise<ProductProxy> {
    const entity = await this.productService.get(productId, crudRequest)
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
    return map(entities, entity => entity.toProxy())
  }

  /**
   * Method that is called when the user access the "/products/:id"
   * route with the "PATCH" method
   * @param productId stores the product id
   * @param requestUser stores the logged user data
   * @param updateProductPayload stores the new product data
   */
  @ApiOperation({ summary: 'Updates a single product' })
  @ApiOkResponse({ description: 'Updates a single product' })
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

  /**
   * Method that is called when the user access the "/products/:id"
   * route with the "DELETE" method
   * @param productId stores the product id
   * @param requestUser stores the logged user data
   */
  @ProtectTo(RolesEnum.Seller, RolesEnum.Admin)
  @Delete(':id')
  public async delete(
    @Param('id') productId: number,
    @User() requestUser: RequestUser
  ): Promise<void> {
    await this.productService.delete(productId, requestUser)
  }

  /**
   * Method that is called when the user access the
   * "/products/:id/disable" route with the "PUT" method
   * @param productId stores the product id
   * @param requestUser stores the logged user data
   */
  @ApiOperation({ summary: 'Disables a single product entity' })
  @ApiOkResponse({ description: 'Disables a single product entity' })
  @ProtectTo(RolesEnum.Seller, RolesEnum.Admin)
  @Put(':id/disable')
  public async disable(
    @Param('id') productId: number,
    @User() requestUser: RequestUser
  ): Promise<void> {
    await this.productService.disable(productId, requestUser)
  }

  /**
   * Method that is called when the user access the
   * "/products/:id/enable" route with the "PUT" method
   * @param productId stores the product id
   * @param requestUser stores the logged user data
   */
  @ApiOperation({ summary: 'Enables a single product entity' })
  @ApiOkResponse({ description: 'Enables a single product entity' })
  @ProtectTo(RolesEnum.Seller, RolesEnum.Admin)
  @Put(':id/enable')
  public async enable(
    @Param('id') productId: number,
    @User() requestUser: RequestUser
  ): Promise<void> {
    await this.productService.enable(productId, requestUser)
  }
}
