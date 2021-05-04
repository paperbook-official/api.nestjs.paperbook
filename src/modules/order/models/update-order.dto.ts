import { ApiPropertyOptional } from '@nestjs/swagger'

import { IsEnum, IsOptional } from 'class-validator'
import { OrderStatus } from 'src/models/enums/order-status.enum'

/**
 * The app's main update order dto class
 *
 * Class that handles the dto sent by the user to perform the updated
 */
export class UpdateOrderDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsEnum(OrderStatus, {
    message: 'It is required to send a valid order number'
  })
  public status?: OrderStatus
}
