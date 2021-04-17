import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'

import { OrderEntity } from '../entities/order.entity'

import { BaseGetManyDefaultResponseDto } from 'src/common/base-get-many-default-response.dto'
import { BaseResponseDto } from 'src/common/base-response.dto'
import { ProductDto } from 'src/modules/product/models/product.dto'
import { UserDto } from 'src/modules/user/models/user.dto'

import { OrderStatus } from 'src/models/enums/order-status.enum'

/**
 * The app's main order dto class
 *
 * Class that deals with the ordder return data
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

  @ApiPropertyOptional({ type: () => ProductDto })
  public product?: ProductDto

  public constructor(entity: OrderEntity) {
    super(entity)

    this.status = entity.status
    this.trackingCode = entity.trackingCode
    this.userId = entity.userId
    this.productId = entity.productId

    // relations
    this.user = entity.user?.toDto()
    this.product = entity.product?.toDto()
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
