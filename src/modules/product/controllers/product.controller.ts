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
  UseInterceptors,
} from '@nestjs/common'
import {
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger'
import {
  Crud,
  CrudRequest,
  CrudRequestInterceptor,
  GetManyDefaultResponse,
  ParsedRequest,
} from '@nestjsx/crud'

import { ApiPropertyGetManyDefaultResponse } from 'src/decorators/api-property-get-many/api-property-get-many.decorator'
import { ApiPropertyGet } from 'src/decorators/api-property-get/api-property-get.decorator'
import { ProtectTo } from 'src/decorators/protect-to/protect-to.decorator'
import { RequestUser } from 'src/decorators/request-user/request-user.decorator'

import { UserEntity } from 'src/modules/user/entities/user.entity'

import { CreateProductDto } from '../models/create-product.dto'
import { GetManyProductDtoResponse, ProductDto } from '../models/product.dto'
import { UpdateProductDto } from '../models/update-product.dto'
import { RolesEnum } from 'src/models/enums/roles.enum'

import { ProductService } from '../services/product.service'

import { map } from 'src/utils/crud'

/**
 * The app's main products controller class
 *
 * Class that deals with the products routes
 */
@Crud({
  model: {
    type: ProductDto,
  },
  query: {
    persist: ['id', 'isActive'],
    filter: [{ field: 'isActive', operator: '$eq', value: true }],
    join: {
      rating: {},
      user: {},
      orders: {},
      categories: {},
      shoppingCarts: {},
      ratings: {},
      product: {},
      'user.addresses': {},
    },
  },
  routes: {
    exclude: [
      'createManyBase',
      'createOneBase',
      'updateOneBase',
      'replaceOneBase',
      'getOneBase',
      'recoverOneBase',
      'getManyBase',
      'deleteOneBase',
    ],
  },
})
@UseInterceptors(CrudRequestInterceptor)
@ApiTags('products')
@Controller('products')
export class ProductController {
  public constructor(private readonly productService: ProductService) {}

  /**
   * Method that is called when the user access the "/products"
   * route with the "POST" method
   *
   * @param requestUser stores the logged user data
   * @param createProductDto stores the new product data
   * @throws {EntityNotFoundException} if the user was not found
   * @throws {ForbiddenException} if the request user has no permissions
   * to execute this action
   * @returns the created product data
   */
  @ProtectTo(RolesEnum.Admin, RolesEnum.Seller)
  @ApiOperation({ summary: 'Creates a new product' })
  @ApiCreatedResponse({
    description: 'Gets the created product data',
    type: ProductDto,
  })
  @ApiNotFoundResponse({ description: 'User not found' })
  @ApiForbiddenResponse({
    description: 'The user has no permission to access those sources',
  })
  @Post()
  public async create(
    @RequestUser() requestUser: UserEntity,
    @Body() createProductDto: CreateProductDto,
  ): Promise<ProductDto> {
    const entity = await this.productService.create(
      requestUser,
      createProductDto,
    )
    return entity.toDto()
  }

  /**
   * Method that is called when the user access the "/products/less-than"
   * route with "GET" method passing the "maxPrice" query
   *
   * @param maxPrice stores the max price value
   * @param crudRequest stores the filters, joins, etc
   * @throws {EntityNotFoundException} if the product was not found
   * @returns all the found elements
   */
  @ApiPropertyGetManyDefaultResponse()
  @ApiOperation({
    summary: 'Retrieves all the products with price less than "maxPrice" value',
  })
  @ApiQuery({
    required: true,
    name: 'maxPrice',
    type: 'integer',
    description:
      'Selects products with full Price parameter less than this value.',
  })
  @ApiOkResponse({
    description: 'Gets all the products with price less than "maxPrice" value',
    type: GetManyProductDtoResponse,
  })
  @ApiNotFoundResponse({ description: 'Product not found' })
  @Get('less-than')
  public async listLessThan(
    @Query('maxPrice', ParseIntPipe) maxPrice: number,
    @ParsedRequest() crudRequest?: CrudRequest,
  ): Promise<GetManyDefaultResponse<ProductDto> | ProductDto[]> {
    const entities = await this.productService.listLessThan(
      maxPrice,
      crudRequest,
    )
    return map(entities, entity => entity.toDto())
  }

  /**
   * Method that is called when the user access the "/products/offers"
   * route with "GET" method
   *
   * @param crudRequest stores the joins, filters, etc
   * @returns all the found products
   */
  @ApiPropertyGetManyDefaultResponse()
  @ApiOperation({
    summary: 'Retrieves all the products with discount greater than 0',
  })
  @ApiOkResponse({
    description: 'Gets all the products with discount greater than 0',
    type: GetManyProductDtoResponse,
  })
  @Get('on-sale')
  public async listOnSale(
    @ParsedRequest() crudRequest?: CrudRequest,
  ): Promise<GetManyDefaultResponse<ProductDto> | ProductDto[]> {
    const entities = await this.productService.listOnSale(crudRequest)
    return map(entities, entity => entity.toDto())
  }

  /**
   * Method that is called when the user access the "/products/free-of-interests"
   * route with "GET" method
   *
   * @param crudRequest stores the joins, filters, etc
   * @returns all the found products
   */
  @ApiPropertyGetManyDefaultResponse()
  @ApiOperation({
    summary: 'Retrieves all the products with no installment price',
  })
  @ApiOkResponse({
    description: 'Gets all the products with no installment price',
    type: GetManyProductDtoResponse,
  })
  @Get('free-of-interests')
  public async listFreeOfInterests(
    @ParsedRequest() crudRequest?: CrudRequest,
  ): Promise<GetManyDefaultResponse<ProductDto> | ProductDto[]> {
    const entities = await this.productService.listFreeOfInterests(crudRequest)
    return map(entities, entity => entity.toDto())
  }

  /**
   * Method that is called when the user access the "products/recent" route
   * with "GET" method
   *
   * @param crudRequest stores the joins, filter, etc
   * @returns all the found elements
   */
  @ApiOperation({
    summary: 'Retrieves all the products organized by "createdAt" field',
  })
  @ApiPropertyGetManyDefaultResponse()
  @ApiOkResponse({
    description: 'Gets all the products organized by "createdAt" field',
    type: GetManyProductDtoResponse,
  })
  @Get('recent')
  public async listRecent(
    @ParsedRequest() crudRequest?: CrudRequest,
  ): Promise<GetManyDefaultResponse<ProductDto> | ProductDto[]> {
    const entities = await this.productService.listRecent(crudRequest)
    return map(entities, entity => entity.toDto())
  }

  /**
   * Method that is called when the user access the "products/most-bought" route
   * with "GET" method
   *
   * @param crudRequest stores the joins, filter, etc
   * @returns all the found elements
   */
  @ApiPropertyGetManyDefaultResponse()
  @ApiOperation({
    summary: 'Retrieves all the products organized by "ordersAmount" field',
  })
  @ApiOkResponse({
    description: 'Gets all the products organized by "ordersAmount" field',
    type: GetManyProductDtoResponse,
  })
  @Get('most-bought')
  public async listMostBought(
    @ParsedRequest() crudRequest?: CrudRequest,
  ): Promise<GetManyDefaultResponse<ProductDto> | ProductDto[]> {
    const entities = await this.productService.listMostBought(crudRequest)
    return map(entities, entity => entity.toDto())
  }

  /**
   * Method that is called when the user access the "/products/:id" route
   * with the "GET" method
   *
   * @param productId stores the product id
   * @param crudRequest store the joins, filters, etc
   * @throws {EntityNotFoundException} if the product was not found
   * @returns the found entity dto
   */
  @ApiPropertyGet()
  @ApiOperation({ summary: 'Retrieves a single ProductDto' })
  @ApiOkResponse({
    description: 'Retrieve a single ProductDto',
    type: ProductDto,
  })
  @ApiNotFoundResponse({ description: 'Product not found' })
  @Get(':id')
  public async listOne(
    @Param('id') productId: number,
    @ParsedRequest() crudRequest?: CrudRequest,
  ): Promise<ProductDto> {
    const entity = await this.productService.listOne(productId, crudRequest)
    return entity.toDto()
  }

  /**
   * Method that is called when the user access the "/products" route
   * with the "GET" method
   *
   * @param crudRequest stores the joins, filters, etc
   * @returns all the found entity dtos
   */
  @ApiPropertyGetManyDefaultResponse()
  @ApiOperation({ summary: 'Retrieves multiple ProductDto' })
  @ApiOkResponse({
    description: 'Get many base response',
    type: GetManyProductDtoResponse,
  })
  @Get()
  public async listMany(
    @ParsedRequest() crudRequest?: CrudRequest,
  ): Promise<GetManyDefaultResponse<ProductDto> | ProductDto[]> {
    const entities = await this.productService.getMany(crudRequest)
    return map(entities, entity => entity.toDto())
  }

  /**
   * Method that is called when the user access the "/products/:id" route
   * with the "PATCH" method
   *
   * @param productId stores the product id
   * @param requestUser stores the logged user data
   * @param updateProductPayload stores the new product data
   * @throws {EntityNotFoundException} if the product was not found
   * @throws {ForbiddenException} if the request user has no permissions
   * to execute this action
   */
  @ProtectTo(RolesEnum.Seller, RolesEnum.Admin)
  @ApiOperation({ summary: 'Updates a single product' })
  @ApiOkResponse({ description: 'Updates a single product' })
  @ApiNotFoundResponse({ description: 'Product not found' })
  @ApiForbiddenResponse({
    description: 'The user has no permission to access those sources',
  })
  @Patch(':id')
  public async update(
    @Param('id') productId: number,
    @RequestUser() requestUser: UserEntity,
    @Body() updateProductPayload: UpdateProductDto,
  ): Promise<void> {
    await this.productService.update(
      productId,
      requestUser,
      updateProductPayload,
    )
  }

  /**
   * Method that is called when the user access the "/products/:id" route
   * with the "DELETE" method
   *
   * @param productId stores the product id
   * @param requestUser stores the logged user data
   * @throws {EntityNotFoundException} if the product was not found
   * @throws {ForbiddenException} if the request user has no permissions
   * to execute this action
   */
  @ProtectTo(RolesEnum.Seller, RolesEnum.Admin)
  @ApiNotFoundResponse({ description: 'Product not found' })
  @ApiForbiddenResponse({
    description: 'The user has no permission to access those sources',
  })
  @Delete(':id')
  public async delete(
    @Param('id') productId: number,
    @RequestUser() requestUser: UserEntity,
  ): Promise<void> {
    await this.productService.delete(productId, requestUser)
  }

  /**
   * Method that is called when the user access the "/products/:id/disable"
   * route with the "PUT" method
   *
   * @param productId stores the product id
   * @param requestUser stores the logged user data
   * @throws {EntityNotFoundException} if the product was not found
   * @throws {EntityAlreadyDisabledException} if the product entity is already disabled
   * @throws {ForbiddenException} if the request user has no permissions
   * to execute this action
   */
  @ProtectTo(RolesEnum.Seller, RolesEnum.Admin)
  @ApiOperation({ summary: 'Disables a single product entity' })
  @ApiOkResponse({ description: 'Disables a single product entity' })
  @ApiNotFoundResponse({ description: 'Product not found' })
  @ApiForbiddenResponse({
    description: 'The user has no permission to access those sources',
  })
  @ApiConflictResponse({ description: 'The product is already disabled' })
  @Put(':id/disable')
  public async disable(
    @Param('id') productId: number,
    @RequestUser() requestUser: UserEntity,
  ): Promise<void> {
    await this.productService.disable(productId, requestUser)
  }

  /**
   * Method that is called when the user access the "/products/:id/enable"
   * route with the "PUT" method
   *
   * @param productId stores the product id
   * @param requestUser stores the logged user data
   * @throws {EntityNotFoundException} if the product was not found
   * @throws {EntityAlreadyEnabledException} if the product entity is already enabled
   * @throws {ForbiddenException} if the request user has no permissions
   * to execute this action
   */
  @ProtectTo(RolesEnum.Seller, RolesEnum.Admin)
  @ApiOperation({ summary: 'Enables a single product entity' })
  @ApiOkResponse({ description: 'Enables a single product entity' })
  @ApiNotFoundResponse({ description: 'Product not found' })
  @ApiForbiddenResponse({
    description: 'The user has no permission to access those sources',
  })
  @ApiConflictResponse({ description: 'The product is already enabled' })
  @Put(':id/enable')
  public async enable(
    @Param('id') productId: number,
    @RequestUser() requestUser: UserEntity,
  ): Promise<void> {
    await this.productService.enable(productId, requestUser)
  }
}
