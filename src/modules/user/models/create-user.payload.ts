import { ApiProperty } from '@nestjs/swagger'

import { IsDefined, IsEmail, IsString, MinLength } from 'class-validator'
import { DefaultValidationMessages } from 'src/models/default-validation-messages'

/**
 * The app's main create user payload class
 *
 * Class that handles the payload sent by the user to perform the creation
 */
export class CreateUserPayload {
  @ApiProperty()
  @IsDefined({ message: 'It is required to send the name.' })
  @IsString({ message: DefaultValidationMessages.IsString })
  public name: string

  @ApiProperty()
  @IsDefined({ message: 'It is required to send the email.' })
  @IsString({ message: DefaultValidationMessages.IsString })
  @IsEmail({}, { message: DefaultValidationMessages.IsEmail })
  public email: string

  @ApiProperty()
  @IsDefined({ message: 'It is required to send the password.' })
  @IsString({ message: DefaultValidationMessages.IsString })
  @MinLength(6, { message: 'The password mut have, at least, 6 characters.' })
  public password: string
}
