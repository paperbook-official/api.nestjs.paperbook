import { ApiProperty } from '@nestjs/swagger'

import { IsDefined, IsNumber, Min } from 'class-validator'
import { DefaultValidationMessages } from 'src/models/enums/default-validation-messages.enum'

/**
 * The app's main create shopping cart dto class
 *
 * Class that handles the dto sent by the user to perform the create
 */
export class CreateShoppingCartDto {
  @ApiProperty()
  @IsDefined({ message: 'It is required to send te user id' })
  @IsNumber(
    { maxDecimalPlaces: 0 },
    { message: DefaultValidationMessages.IsNumber }
  )
  @Min(0)
  public userId: number
}
