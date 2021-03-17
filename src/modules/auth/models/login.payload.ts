import { ApiProperty } from '@nestjs/swagger'

import { IsDefined, IsEmail, IsString, MinLength } from 'class-validator'
import { DefaultValidationMessages } from 'src/models/enums/default-validation-messages.enum'

/**
 * The app's main login payload class
 *
 * Class that handles the payload sent by the user to perform the login
 */
export class LoginPayload {
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
