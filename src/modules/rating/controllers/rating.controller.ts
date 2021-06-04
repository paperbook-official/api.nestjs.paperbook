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
  ApiProperty,
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

import { CreateRatingDto } from '../models/create-rating.dto'
import { RatingDto } from '../models/rating.dto'
import { UpdateRatingDto } from '../models/update-rating.dto'
import { RolesEnum } from 'src/models/enums/roles.enum'
import { GetManyShoppingCartDtoResponse } from 'src/modules/shopping-cart/models/shopping-cart.dto'

import { RatingService } from '../services/rating.service'

import { map } from 'src/utils/crud'

/**
 * The app's main rating controller class
 *
 * Class that deals with the rating routes
 */
@Crud({
  model: {
    type: RatingDto,
  },
  query: {
    persist: ['id', 'isActive'],
    filter: [{ field: 'isActive', operator: '$eq', value: true }],
    join: {
      product: {},
      user: {},
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
@ApiTags('ratings')
@Controller('ratings')
export class RatingController {
  public constructor(private readonly ratingService: RatingService) {}

  /**
   * Method that is called when the user access the "/ratings"
   * route with the "POST" method
   *
   * @param requestUser stores the logged user data
   * @param createRatingDto stores the rating data
   * @throws {EntityNotFoundException} if the user was not found
   * @throws {EntityNotFoundException} if the product was not found
   * @throws {ForbiddenException} if the request user has no permission
   * to access those sources
   * @returns the created rating entity dto
   */
  @ProtectTo(RolesEnum.Common, RolesEnum.Seller, RolesEnum.Admin)
  @ApiOperation({ summary: 'Creates a new rating' })
  @ApiCreatedResponse({
    description: 'Gets the created rating data',
    type: RatingDto,
  })
  @ApiNotFoundResponse({ description: 'User not found' })
  @ApiNotFoundResponse({ description: 'Product not found' })
  @ApiForbiddenResponse({
    description: 'The user has no permission to access those sources',
  })
  @Post()
  public async create(
    @RequestUser() requestUser: UserEntity,
    @Body() createRatingDto: CreateRatingDto,
  ): Promise<RatingDto> {
    const entity = await this.ratingService.create(requestUser, createRatingDto)
    return entity.toDto()
  }

  /**
   * Method that can get rating entities
   *
   * @param crudRequest stores the joins, filters, etc
   * @returns all the found rating entity dtos
   */
  @ApiPropertyGetManyDefaultResponse()
  @ApiPropertyGetManyDefaultResponse()
  @ApiOperation({ summary: 'Retrieves multiple ShoppingCartDto' })
  @ApiOkResponse({
    description: 'Get many base response',
    type: GetManyShoppingCartDtoResponse,
  })
  @Get()
  public async listMany(
    @ParsedRequest() crudRequest?: CrudRequest,
  ): Promise<GetManyDefaultResponse<RatingDto> | RatingDto[]> {
    const entities = await this.ratingService.getMany(crudRequest)
    return map(entities, entity => entity.toDto())
  }

  /**
   * Method that is called when the user access the "/ratings/:id"
   * route with the "GET" method
   *
   * @param ratingId stores the rating id
   * @param crudRequest stores the joins, filters, etc
   * @throws {EntityNotFoundException} if the rating was not found
   * @returns the found rating entity dto
   */
  @ApiProperty()
  @ApiPropertyGet()
  @ApiOperation({ summary: 'Retrieves a single RatingDto' })
  @ApiOkResponse({
    description: 'Retrieve a single RatingDto',
    type: RatingDto,
  })
  @ApiNotFoundResponse({ description: 'Rating not found' })
  @Get(':id')
  public async listOne(
    @Param('id') ratingId: number,
    @ParsedRequest() crudRequest?: CrudRequest,
  ): Promise<RatingDto> {
    const entity = await this.ratingService.listOne(ratingId, crudRequest)
    return entity.toDto()
  }

  /**
   * Method that is called when the user access the "/ratings/:id"
   * route with the "PATCH" method
   *
   * @param ratingId stores the rating id
   * @param requestUser stores the logged user data
   * @param updateRatingDto stores the rating entity new data
   * @throws {EntityNotFoundException} if the rating was not found
   * @throws {ForbiddenException} if the request user has no permission
   * to access those sources
   */
  @ProtectTo(RolesEnum.Common, RolesEnum.Seller, RolesEnum.Admin)
  @ApiOperation({ summary: 'Updates a single rating entity' })
  @ApiOkResponse({ description: 'Updates a single rating entity' })
  @ApiNotFoundResponse({ description: 'Rating not found' })
  @ApiForbiddenResponse({
    description: 'The user has no permission to access those sources',
  })
  @Patch(':id')
  public async update(
    @Param('id') ratingId: number,
    @RequestUser() requestUser: UserEntity,
    @Body() updateRatingDto: UpdateRatingDto,
  ): Promise<void> {
    await this.ratingService.update(ratingId, requestUser, updateRatingDto)
  }

  /**
   * Method that is called when the user access the "/ratings/:id"
   * route with the "DELETE" method
   *
   * @param ratingId stores the rating id
   * @param requestUser stores the logged user data
   * @throws {EntityNotFoundException} if the rating was not found
   * @throws {ForbiddenException} if the request user has no permission
   * to access those sources
   */
  @ProtectTo(RolesEnum.Common, RolesEnum.Seller, RolesEnum.Admin)
  @ApiOperation({ summary: 'Delete a single rating' })
  @ApiOkResponse({ description: 'Delete one base response' })
  @ApiNotFoundResponse({ description: 'Rating not found' })
  @ApiForbiddenResponse({
    description: 'The user has no permission to access those sources',
  })
  @Delete(':id')
  public async delete(
    @Param('id') ratingId: number,
    @RequestUser() requestUser: UserEntity,
  ): Promise<void> {
    await this.ratingService.delete(ratingId, requestUser)
  }

  /**
   * Method that is called when the user access the
   * "/products/:id/disable" route with the "PUT" method
   *
   * @param ratingId stores the product id
   * @param requestUser stores the logged user data
   * @throws {EntityNotFoundException} if the address was not found
   * @throws {ForbiddenException} if the request user has no permission
   * to access those sources
   * @throws {EntityAlreadyDisabledException} if the address is already disabled
   */
  @ProtectTo(RolesEnum.Common, RolesEnum.Seller, RolesEnum.Admin)
  @ApiOperation({ summary: 'Disables a single rating entity' })
  @ApiOkResponse({ description: 'Disables a single rating entity' })
  @ApiNotFoundResponse({ description: 'Rating not found' })
  @ApiForbiddenResponse({
    description: 'The user has no permission to access those sources',
  })
  @ApiConflictResponse({ description: 'The rating is already disabled' })
  @Put(':id/disable')
  public async disable(
    @Param('id') ratingId: number,
    @RequestUser() requestUser: UserEntity,
  ): Promise<void> {
    await this.ratingService.disable(ratingId, requestUser)
  }

  /**
   * Method that is called when the user access the
   * "/products/:id/enable" route with the "PUT" method
   *
   * @param ratingId stores the product id
   * @param requestUser stores the logged user data
   * @throws {EntityNotFoundException} if the rating was not found
   * @throws {ForbiddenException} if the request user has no permission
   * to access those sources
   * @throws {EntityAlreadyEnabledException} if the rating is already enabled
   */
  @ProtectTo(RolesEnum.Common, RolesEnum.Seller, RolesEnum.Admin)
  @ApiOperation({ summary: 'Enables a single rating entity' })
  @ApiOkResponse({ description: 'Enables a single rating entity' })
  @ApiNotFoundResponse({ description: 'Rating not found' })
  @ApiForbiddenResponse({
    description: 'The user has no permission to access those sources',
  })
  @ApiConflictResponse({ description: 'The rating is already enabled' })
  @Put(':id/enable')
  public async enable(
    @Param('id') ratingId: number,
    @RequestUser() requestUser: UserEntity,
  ): Promise<void> {
    await this.ratingService.enable(ratingId, requestUser)
  }
}
