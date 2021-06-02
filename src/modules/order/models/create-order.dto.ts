import { ApiProperty } from '@nestjs/swagger'

import { DefaultValidationMessages } from 'src/models/enums/default-validation-messages.enum'

import { IsDefined, IsNumber } from 'class-validator'

/**
 * The app's main create order dto class
 *
 * Class that handles the dto sent by the user to perform the create
 */
export class CreateOrderDto {
  @ApiProperty()
  @IsDefined({ message: 'It is required to send the shipping price' })
  @IsNumber(
    { maxDecimalPlaces: 2 },
    { message: DefaultValidationMessages.IsNumber },
  )
  public shippingPrice: number

  @ApiProperty()
  @IsDefined({ message: 'It is required to send the user id' })
  @IsNumber(
    { maxDecimalPlaces: 0 },
    { message: DefaultValidationMessages.IsNumber },
  )
  public userId: number

  @ApiProperty()
  @IsDefined({ message: 'It is required to send the address id' })
  @IsNumber(
    { maxDecimalPlaces: 0 },
    { message: DefaultValidationMessages.IsNumber },
  )
  public addressId: number
}
