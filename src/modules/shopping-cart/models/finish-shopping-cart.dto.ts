import { ApiProperty } from '@nestjs/swagger'

import { IsDefined, IsNumber } from 'class-validator'
import { DefaultValidationMessages } from 'src/models/enums/default-validation-messages.enum'

/**
 * The app's main finish shopping cart dto class
 *
 * Class that handles the dto sent by the user to perform the finishing
 */
export class FinishShoppingCartDto {
  @ApiProperty()
  @IsDefined({ message: 'It is required to send the shipping price' })
  @IsNumber(
    { maxDecimalPlaces: 2 },
    { message: DefaultValidationMessages.IsNumber }
  )
  public shippingPrice: number

  @ApiProperty()
  @IsDefined({ message: 'It is required to send the address id' })
  @IsNumber(
    { maxDecimalPlaces: 0 },
    { message: DefaultValidationMessages.IsNumber }
  )
  public addressId: number
}
