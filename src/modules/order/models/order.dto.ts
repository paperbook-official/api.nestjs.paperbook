import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'

import { OrderEntity } from '../entities/order.entity'

import { BaseGetManyDefaultResponseDto } from 'src/common/base-get-many-default-response.dto'
import { BaseResponseDto } from 'src/common/base-response.dto'
import { ProductGroupDto } from 'src/modules/product-group/models/product-group.dto'
import { UserDto } from 'src/modules/user/models/user.dto'

import { OrderStatus } from 'src/models/enums/order-status.enum'

/**
 * The app's main order dto class
 *
 * Class that deals with the order return data
 */
export class OrderDto extends BaseResponseDto {
  @ApiProperty()
  public status: OrderStatus

  @ApiProperty()
  public trackingCode: string

  @ApiProperty()
  public userId: number

  @ApiProperty()
  public productId: number

  @ApiPropertyOptional({ type: () => UserDto })
  public user?: UserDto

  @ApiPropertyOptional({ type: () => ProductGroupDto, isArray: true })
  public productGroups?: ProductGroupDto[]

  public constructor(entity: OrderEntity) {
    super(entity)

    this.status = entity.status
    this.trackingCode = entity.trackingCode
    this.userId = entity.userId
    this.productId = entity.productId

    // relations
    this.user = entity.user?.toDto()
    this.productGroups = entity.productGroups?.map(order => order.toDto())
  }
}

/**
 * The app's main get many order dto response
 *
 * Class that deals with the order return data with pagination
 */
export class GetManyOrderDtoResponse extends BaseGetManyDefaultResponseDto {
  @ApiProperty({ type: OrderDto, isArray: true })
  public data: OrderDto[]
}
