import { ApiProperty } from '@nestjs/swagger'

import { IsDefined, IsNumber, Min } from 'class-validator'
import { DefaultValidationMessages } from 'src/models/enums/default-validation-messages.enum'

/**
 * The app's main create shopping cart payload class
 *
 * Class that handles the payload sent by the user to perform the create
 */
export class CreateShoppingCartPayload {
  @ApiProperty()
  @IsDefined({ message: 'It is required to send te product id' })
  @IsNumber(
    { maxDecimalPlaces: 0 },
    { message: DefaultValidationMessages.IsNumber }
  )
  @Min(0)
  public productId: number

  @ApiProperty()
  @IsDefined({ message: 'It is required to send te user id' })
  @IsNumber(
    { maxDecimalPlaces: 0 },
    { message: DefaultValidationMessages.IsNumber }
  )
  @Min(0)
  public userId: number
}
