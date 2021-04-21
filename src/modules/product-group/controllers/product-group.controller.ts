import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put
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
  GetManyDefaultResponse,
  ParsedRequest
} from '@nestjsx/crud'

import { ProtectTo } from 'src/decorators/protect-to/protect-to.decorator'
import { RequestUser } from 'src/decorators/user/user.decorator'

import { UserEntity } from 'src/modules/user/entities/user.entity'

import { CreateProductGroupDto } from '../models/create-product-group.dto'
import { ProductGroupDto } from '../models/product-group.dto'
import { UpdateProductGroupDto } from '../models/update-product-group.dto'

import { ProductGroupService } from '../services/product-group.service'

import { map } from 'src/utils/crud'

import { RolesEnum } from 'src/models/enums/roles.enum'

/**
 * The app's main product group controller class
 *
 * Class that deals with the product group routes
 */
@Crud({
  model: {
    type: ProductGroupDto
  },
  query: {
    persist: ['id', 'isActive'],
    filter: [{ field: 'isActive', operator: '$eq', value: true }],
    join: {
      product: {},
      shoppingCart: {}
    }
  }
})
@ApiTags('product-groups')
@Controller('product-groups')
export class ProductGroupController {
  public constructor(
    private readonly productGroupService: ProductGroupService
  ) {}

  /**
   * Method that is called when the user access the "/product-groups"
   * route with the "POST" method
   * @param requestUser stores the logged user data
   * @param createProductGroupDto stores the new product group data
   * @returns the created product group entity dto
   */
  @ApiOperation({ summary: 'Creates a new product group' })
  @ApiCreatedResponse({
    description: 'Gets the created product group',
    type: ProductGroupDto
  })
  @ProtectTo(RolesEnum.Admin)
  @Post()
  public async create(
    @RequestUser() requestUser: UserEntity,
    @Body() createProductGroupDto: CreateProductGroupDto
  ): Promise<ProductGroupDto> {
    const entity = await this.productGroupService.create(
      requestUser,
      createProductGroupDto
    )
    return entity.toDto()
  }

  /**
   * Method that is called when the user access the "/product-groups/:id"
   * route with the "GET" method
   * @param productGroupId stores the product group id
   * @param crudRequest stores the joins, filters, etc
   * @returns the found product group entity dto
   */
  @ProtectTo(RolesEnum.Admin)
  @Get(':id')
  public async get(
    @Param('id') productGroupId: number,
    @ParsedRequest() crudRequest?: CrudRequest
  ): Promise<ProductGroupDto> {
    const entity = await this.productGroupService.get(
      productGroupId,
      crudRequest
    )
    return entity.toDto()
  }

  /**
   * Method that is called when the user access the "/product-groups"
   * route with the "GET" method
   * @param crudRequest
   * @returns
   */
  @ProtectTo(RolesEnum.Admin)
  @Get()
  public async getMore(
    crudRequest?: CrudRequest
  ): Promise<GetManyDefaultResponse<ProductGroupDto> | ProductGroupDto[]> {
    const entities = await this.productGroupService.getMany(crudRequest)
    return map(entities, entity => entity.toDto())
  }

  /**
   * Method that is called when the user access the "/product-groups/:id"
   * route with the "PATCH" method
   * @param productGroupId stores the product group id
   * @param updateProductGroupDto stores the product group new data
   */
  @ApiOperation({ summary: 'Updates a single product group' })
  @ApiOkResponse({ description: 'Updates a single product group' })
  @ProtectTo(RolesEnum.Admin)
  @Patch(':id')
  public async update(
    @Param('id') productGroupId: number,
    @Body() updateProductGroupDto: UpdateProductGroupDto
  ): Promise<void> {
    await this.productGroupService.update(productGroupId, updateProductGroupDto)
  }

  /**
   * Method that is called when the user access the "/product-groups/:id"
   * route with the "DELETE" method
   * @param productGroupId stores the product group id
   */
  @ProtectTo(RolesEnum.Admin)
  @Delete(':id')
  public async delete(@Param('id') productGroupId: number): Promise<void> {
    await this.productGroupService.delete(productGroupId)
  }

  /**
   * Method that is called when the user access the
   * "/products/:id/disable" route with the "PUT" method
   * @param productId stores the product id
   */
  @ApiOperation({ summary: 'Disables a single product group entity' })
  @ApiOkResponse({ description: 'Disables a single product group entity' })
  @ProtectTo(RolesEnum.Admin)
  @Put(':id/disable')
  public async disable(@Param('id') productId: number): Promise<void> {
    await this.productGroupService.disable(productId)
  }

  /**
   * Method that is called when the user access the
   * "/products/:id/enable" route with the "PUT" method
   * @param productId stores the product id
   */
  @ApiOperation({ summary: 'Enables a single product group entity' })
  @ApiOkResponse({ description: 'Enables a single product group entity' })
  @ProtectTo(RolesEnum.Admin)
  @Put(':id/enable')
  public async enable(@Param('id') productId: number): Promise<void> {
    await this.productGroupService.enable(productId)
  }
}
