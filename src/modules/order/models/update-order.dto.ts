import { ApiPropertyOptional } from '@nestjs/swagger'

import { IsEnum, IsOptional, IsString } from 'class-validator'
import { DefaultValidationMessages } from 'src/models/enums/default-validation-messages.enum'
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

  @ApiPropertyOptional()
  @IsOptional()
  @IsString({ message: DefaultValidationMessages.IsString })
  public trackingCode?: string
}
