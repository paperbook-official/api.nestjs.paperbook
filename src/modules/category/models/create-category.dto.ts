import { ApiProperty } from '@nestjs/swagger'

import { IsDefined, IsString } from 'class-validator'
import { DefaultValidationMessages } from 'src/models/enums/default-validation-messages.enum'

/**
 * The app's main create address dto class
 *
 * Class that handles the dto sent by the user to perform the create
 */
export class CreateCategoryDto {
  @ApiProperty()
  @IsDefined({ message: 'It is required to send the name' })
  @IsString({ message: DefaultValidationMessages.IsString })
  public name: string
}
