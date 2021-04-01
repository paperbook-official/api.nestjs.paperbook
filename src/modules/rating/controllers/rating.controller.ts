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

import { CreateRatingPayload } from '../models/create-rating.payload'
import { RatingProxy } from '../models/rating.proxy'
import { UpdateRatingPayload } from '../models/update-rating.payload'

import { RatingService } from '../services/rating.service'

import { map } from 'src/utils/crud'

import { RolesEnum } from 'src/models/enums/roles.enum'

/**
 * The app's main rating controller class
 *
 * Class that deals with the rating routes
 */
@Crud({
  model: {
    type: RatingProxy
  },
  query: {
    persist: ['id', 'isActive'],
    filter: [{ field: 'isActive', operator: '$eq', value: true }],
    join: {
      product: {}
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
@ApiTags('ratings')
@Controller('ratings')
export class RatingController {
  public constructor(private readonly ratingService: RatingService) {}

  /**
   * Method that is called when the user access the "/ratings"
   * route with the "POST" method
   * @param createRatingPayload
   * @returns
   */
  @ApiOperation({ summary: 'Creates a new rating' })
  @ApiCreatedResponse({
    description: 'Gets the created rating data',
    type: RatingProxy
  })
  @ProtectTo(RolesEnum.Admin)
  @Post()
  public async create(
    @Body() createRatingPayload: CreateRatingPayload
  ): Promise<RatingProxy> {
    const entity = await this.ratingService.create(createRatingPayload)
    return entity.toProxy()
  }

  /**
   * Method that is called when the user access the "/ratings/:id"
   * route with the "GET" method
   * @param ratingId stores the rating id
   * @param crudRequest stores the joins, filters, etc
   * @returns the found rating entity proxy
   */
  @ProtectTo(RolesEnum.Admin)
  @Get(':id')
  public async get(
    @Param('id') ratingId: number,
    @ParsedRequest() crudRequest?: CrudRequest
  ): Promise<RatingProxy> {
    const entity = await this.ratingService.get(ratingId, crudRequest)
    return entity.toProxy()
  }

  /**
   * Method that can get rating entities
   * @param crudRequest stores the joins, filters, etc
   * @returns all the found rating entities
   */
  @ProtectTo(RolesEnum.Admin)
  @Get()
  public async getMore(
    @ParsedRequest() crudRequest?: CrudRequest
  ): Promise<GetManyDefaultResponse<RatingProxy> | RatingProxy[]> {
    const entities = await this.ratingService.getMany(crudRequest)
    return map(entities, entity => entity.toProxy())
  }

  /**
   * Method that is called when the user access the "/ratings/:id"
   * route with the "PATCH" method
   * @param ratingId stores the rating id
   * @param updateRatingPayload stores the rating entity new data
   */
  @ApiOperation({ summary: 'Updates a single rating entity' })
  @ApiOkResponse({ description: 'Updates a single rating entity' })
  @ProtectTo(RolesEnum.Admin)
  @Patch(':id')
  public async update(
    @Param('id') ratingId: number,
    @Body() updateRatingPayload: UpdateRatingPayload
  ): Promise<void> {
    await this.ratingService.update(ratingId, updateRatingPayload)
  }

  /**
   * Method that is called when the user access the "/ratings/:id"
   * route with the "DELETE" method
   * @param ratingId stores the rating id
   */
  @ProtectTo(RolesEnum.Admin)
  @Delete(':id')
  public async delete(@Param('id') ratingId: number): Promise<void> {
    await this.ratingService.delete(ratingId)
  }

  /**
   * Method that is called when the user access the
   * "/products/:id/disable" route with the "PUT" method
   * @param productId stores the product id
   * @param requestUser stores the logged user data
   */
  @ApiOperation({ summary: 'Disables a single rating entity' })
  @ApiOkResponse({ description: 'Disables a single rating entity' })
  @ProtectTo(RolesEnum.Admin)
  @Put(':id/disable')
  public async disable(@Param('id') productId: number): Promise<void> {
    await this.ratingService.disable(productId)
  }

  /**
   * Method that is called when the user access the
   * "/products/:id/enable" route with the "PUT" method
   * @param productId stores the product id
   * @param requestUser stores the logged user data
   */
  @ApiOperation({ summary: 'Enables a single rating entity' })
  @ApiOkResponse({ description: 'Enables a single rating entity' })
  @ProtectTo(RolesEnum.Admin)
  @Put(':id/enable')
  public async enable(@Param('id') productId: number): Promise<void> {
    await this.ratingService.enable(productId)
  }
}
