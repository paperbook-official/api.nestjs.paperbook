import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
  UseInterceptors,
} from '@nestjs/common'
import {
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger'
import {
  Crud,
  CrudRequest,
  CrudRequestInterceptor,
  GetManyDefaultResponse,
  ParsedRequest,
} from '@nestjsx/crud'

import { ApiQueryGetMany } from 'src/decorators/api-query-get-many/api-query-get-many.decorator'
import { ApiQueryGet } from 'src/decorators/api-query-get/api-query-get.decorator'
import { ProtectTo } from 'src/decorators/protect-to/protect-to.decorator'

import { CreateProductGroupDto } from '../models/create-product-group.dto'
import {
  GetManyProductGroupDtoResponse,
  ProductGroupDto,
} from '../models/product-group.dto'
import { UpdateProductGroupDto } from '../models/update-product-group.dto'
import { RolesEnum } from 'src/models/enums/roles.enum'

import { ProductGroupService } from '../services/product-group.service'

import { map } from 'src/utils/crud'

/**
 * The app's main product group controller class
 *
 * Class that deals with the product group routes
 */
@Crud({
  model: {
    type: ProductGroupDto,
  },
  query: {
    persist: ['id', 'isActive'],
    filter: [{ field: 'isActive', operator: '$eq', value: true }],
    join: {
      product: {},
      shoppingCart: {},
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
@ApiTags('product-groups')
@Controller('product-groups')
export class ProductGroupController {
  public constructor(
    private readonly productGroupService: ProductGroupService,
  ) {}

  /**
   * Method that is called when the user access the "/product-groups"
   * route with the "POST" method
   *
   * @param createProductGroupDto stores the new product group data
   * @throws {EntityNotFoundException} if the product was not found
   * @throws {EntityNotFoundException} if the shopping cart was not found
   * @returns the created product group entity dto
   */
  @ProtectTo(RolesEnum.Admin)
  @ApiOperation({ summary: 'Creates a new product group' })
  @ApiCreatedResponse({
    description: 'Gets the created product group',
    type: ProductGroupDto,
  })
  @ApiNotFoundResponse({ description: 'Product not found' })
  @ApiNotFoundResponse({ description: 'Shopping cart not found' })
  @ApiForbiddenResponse({
    description: 'The user has no permission to access those sources',
  })
  @Post()
  public async create(
    @Body() createProductGroupDto: CreateProductGroupDto,
  ): Promise<ProductGroupDto> {
    const entity = await this.productGroupService.create(createProductGroupDto)
    return entity.toDto()
  }

  /**
   * Method that is called when the user access the "/product-groups/:id"
   * route with the "GET" method
   *
   * @param productGroupId stores the product group id
   * @param crudRequest stores the joins, filters, etc
   * @throws {EntityNotFoundException} if the product was not found
   * @returns the found product group entity dto
   */
  @ProtectTo(RolesEnum.Admin)
  @ApiQueryGet()
  @ApiOperation({ summary: 'Retrieves a single ProductGroupDto' })
  @ApiOkResponse({
    description: 'Retrieve a single ProductGroupDto',
    type: ProductGroupDto,
  })
  @ApiNotFoundResponse({ description: 'Product not found' })
  @ApiForbiddenResponse({
    description: 'The user has no permission to access those sources',
  })
  @Get(':id')
  public async listOne(
    @Param('id') productGroupId: number,
    @ParsedRequest() crudRequest?: CrudRequest,
  ): Promise<ProductGroupDto> {
    const entity = await this.productGroupService.listOne(
      productGroupId,
      crudRequest,
    )
    return entity.toDto()
  }

  /**
   * Method that is called when the user access the "/product-groups"
   *
   * route with the "GET" method
   * @param crudRequest stores the joins, filters, etc
   * @returns all the found product group entity dtos
   */
  @ProtectTo(RolesEnum.Admin)
  @ApiQueryGetMany()
  @ApiOperation({ summary: 'Retrieves multiple ProductDto' })
  @ApiOkResponse({
    description: 'Get many base response',
    type: GetManyProductGroupDtoResponse,
  })
  @ApiForbiddenResponse({
    description: 'The user has no permission to access those sources',
  })
  @Get()
  public async listMany(
    @ParsedRequest() crudRequest?: CrudRequest,
  ): Promise<GetManyDefaultResponse<ProductGroupDto> | ProductGroupDto[]> {
    const entities = await this.productGroupService.getMany(crudRequest)
    return map(entities, entity => entity.toDto())
  }

  /**
   * Method that is called when the user access the "/product-groups/:id"
   * route with the "PATCH" method
   *
   * @param productGroupId stores the product group id
   * @param updateProductGroupDto stores the product group new data
   * @throws {EntityNotFoundException} if the product group was not found
   */
  @ProtectTo(RolesEnum.Admin)
  @ApiOperation({ summary: 'Updates a single product group' })
  @ApiOkResponse({ description: 'Updates a single product group' })
  @ApiNotFoundResponse({ description: 'Product group not found' })
  @ApiForbiddenResponse({
    description: 'The user has no permission to access those sources',
  })
  @Patch(':id')
  public async update(
    @Param('id') productGroupId: number,
    @Body() updateProductGroupDto: UpdateProductGroupDto,
  ): Promise<void> {
    await this.productGroupService.update(productGroupId, updateProductGroupDto)
  }

  /**
   * Method that is called when the user access the "/product-groups/:id"
   * route with the "DELETE" method
   *
   * @param productGroupId stores the product group id
   * @throws {EntityNotFoundException} if the product group was not found
   */
  @ProtectTo(RolesEnum.Admin)
  @ApiNotFoundResponse({ description: 'Product group not found' })
  @ApiForbiddenResponse({
    description: 'The user has no permission to access those sources',
  })
  @Delete(':id')
  public async delete(@Param('id') productGroupId: number): Promise<void> {
    await this.productGroupService.delete(productGroupId)
  }

  /**
   * Method that is called when the user access the "/products/:id/disable"
   * route with the "PUT" method
   *
   * @param productId stores the product id
   * @throws {EntityNotFoundException} if the product group was not found
   * @throws {EntityAlreadyDisabledException} if the product group entity is already disabled
   */
  @ProtectTo(RolesEnum.Admin)
  @ApiOperation({ summary: 'Disables a single product group entity' })
  @ApiOkResponse({ description: 'Disables a single product group entity' })
  @ApiNotFoundResponse({ description: 'Product group not found' })
  @ApiForbiddenResponse({
    description: 'The user has no permission to access those sources',
  })
  @ApiConflictResponse({ description: 'The product group is already disabled' })
  @Put(':id/disable')
  public async disable(@Param('id') productId: number): Promise<void> {
    await this.productGroupService.disable(productId)
  }

  /**
   * Method that is called when the user access the "/products/:id/enable"
   * route with the "PUT" method
   *
   * @param productId stores the product id
   * @throws {EntityNotFoundException} if the product group was not found
   * @throws {EntityAlreadyEnabledException} if the product group entity is already enabled
   */
  @ProtectTo(RolesEnum.Admin)
  @ApiOperation({ summary: 'Enables a single product group entity' })
  @ApiOkResponse({ description: 'Enables a single product group entity' })
  @ApiNotFoundResponse({ description: 'Product group not found' })
  @ApiForbiddenResponse({
    description: 'The user has no permission to access those sources',
  })
  @ApiConflictResponse({ description: 'The product group is already enabled' })
  @Put(':id/enable')
  public async enable(@Param('id') productId: number): Promise<void> {
    await this.productGroupService.enable(productId)
  }
}
