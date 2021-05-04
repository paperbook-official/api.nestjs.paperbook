import { ApiProperty } from '@nestjs/swagger'

import { IsDefined, IsNumber } from 'class-validator'
import { DefaultValidationMessages } from 'src/models/enums/default-validation-messages.enum'

/**
 * The app's main create order dto class
 *
 * Class that handles the dto sent by the user to perform the create
 */
export class CreateOrderDto {
  @ApiProperty()
  @IsDefined({ message: 'It is required to send the user id' })
  @IsNumber(
    { maxDecimalPlaces: 0 },
    { message: DefaultValidationMessages.IsNumber }
  )
  public userId: number
}
