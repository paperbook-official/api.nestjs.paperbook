import { ApiProperty } from '@nestjs/swagger'

import {
  IsDefined,
  IsNumber,
  IsString,
} from 'class-validator'
import { DefaultValidationMessages } from 'src/models/enums/default-validation-messages.enum'

/**
 * The app's main create address payload class
 *
 * Class that handles the payload sent by the user to perform the create
 */
export class CreateCategoryPayload {

  @ApiProperty()
  @IsDefined({ message: 'It is required to send the name' })
  @IsString({ message: DefaultValidationMessages.IsString })
  public name: string

}
