import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'

import {
  IsDefined,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsNumberString,
  IsOptional,
  IsPhoneNumber,
  IsString,
  MinLength
} from 'class-validator'
import { DefaultValidationMessages } from 'src/models/enums/default-validation-messages.enum'
import { RolesEnum } from 'src/models/enums/roles.enum'
import { IsCpf } from 'src/validators/is-cpf/is-cpf.validator'

/**
 * The app's main create user payload class
 *
 * Class that handles the payload sent by the user to perform the creation
 */
export class CreateUserPayload {
  @ApiProperty()
  @IsDefined({ message: 'It is required to send the name.' })
  @IsString({ message: DefaultValidationMessages.IsString })
  @IsNotEmpty({ message: DefaultValidationMessages.IsNotEmpty })
  public name: string

  @ApiProperty()
  @IsDefined({ message: 'It is required to send the last name.' })
  @IsString({ message: DefaultValidationMessages.IsString })
  public lastName: string

  @ApiProperty()
  @IsDefined({ message: 'It is required to send the email.' })
  @IsString({ message: DefaultValidationMessages.IsString })
  @IsEmail({}, { message: DefaultValidationMessages.IsEmail })
  public email: string

  @ApiProperty()
  @IsDefined({ message: 'It is required to send the password.' })
  @IsString({ message: DefaultValidationMessages.IsString })
  @MinLength(6, { message: 'The password must have, at least, 6 characters.' })
  public password: string

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumberString({}, { message: 'It is required to send a numeric string' })
  @IsCpf({ message: 'It is required to send a valid cpf value' })
  public cpf?: string

  @ApiPropertyOptional()
  @IsOptional()
  @IsEnum(RolesEnum, {
    message: 'It is required to send "user", "admin" or "seller"'
  })
  public roles?: RolesEnum

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumberString({}, { message: 'It is required to send a numeric string' })
  @IsPhoneNumber('BR', {
    message: 'It is required to send a valid phone number'
  })
  public phone?: string
}
