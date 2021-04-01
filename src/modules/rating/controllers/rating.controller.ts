import { Body, Controller, Get, Param, Post } from '@nestjs/common'
import { ApiCreatedResponse, ApiOperation, ApiTags } from '@nestjs/swagger'
import { Crud, CrudRequest, ParsedRequest } from '@nestjsx/crud'

import { ProtectTo } from 'src/decorators/protect-to/protect-to.decorator'

import { CreateRatingPayload } from '../models/create-rating.payload'
import { RatingProxy } from '../models/rating.proxy'

import { RatingService } from '../services/rating.service'

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
}
