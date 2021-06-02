import { ApiProperty } from '@nestjs/swagger'

import { DefaultValidationMessages } from 'src/models/enums/default-validation-messages.enum'

import { IsDefined, IsEmail, IsString, MinLength } from 'class-validator'

/**
 * The app's main login dto class
 *
 * Class that handles the dto sent by the user to perform the login
 */
export class LoginDto {
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
