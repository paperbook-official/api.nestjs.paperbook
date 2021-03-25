import { ApiProperty } from '@nestjs/swagger'

import { IsDefined, IsEnum, IsNumber, IsString, Min } from 'class-validator'
import { DefaultValidationMessages } from 'src/models/enums/default-validation-messages.enum'
import { OrderStatus } from 'src/models/enums/order-status.enum'

/**
 * The app's main create order payload class
 *
 * Class that handles the paylaod sent by the user to perform the create
 */
export class CreateOrderPayload {
  @ApiProperty()
  @IsDefined({ message: 'It is required to send the status' })
  @IsEnum(OrderStatus, {
    message: 'It is required to send a valid order number'
  })
  public status: OrderStatus

  @ApiProperty()
  @IsDefined({ message: 'It is required to send the tracking code' })
  @IsString({ message: DefaultValidationMessages.IsString })
  public trackingCode: string

  @ApiProperty()
  @IsDefined({ message: 'It is required to send the user id' })
  @IsNumber(
    { maxDecimalPlaces: 0 },
    { message: DefaultValidationMessages.IsNumber }
  )
  public userId: number

  @ApiProperty()
  @IsDefined({ message: 'It is required to send the product id' })
  @IsNumber(
    { maxDecimalPlaces: 0 },
    { message: DefaultValidationMessages.IsNumber }
  )
  @Min(1)
  public productId: number
}
