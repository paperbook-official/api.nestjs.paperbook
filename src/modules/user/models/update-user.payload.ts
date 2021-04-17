import { ApiPropertyOptional } from '@nestjs/swagger'

import { IsOptional, IsPhoneNumber, IsString } from 'class-validator'
import { DefaultValidationMessages } from 'src/models/enums/default-validation-messages.enum'
import { IsCpf } from 'src/validators/is-cpf/is-cpf.validator'

/**
 * The app's main update user payload class
 *
 * Class that handles the payload sent by the user to perform the update
 */
export class UpdateUserPaylaod {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString({ message: DefaultValidationMessages.IsString })
  public name?: string

  @ApiPropertyOptional()
  @IsOptional()
  @IsString({ message: DefaultValidationMessages.IsString })
  public lastName?: string

  @ApiPropertyOptional()
  @IsOptional()
  @IsString({ message: DefaultValidationMessages.IsString })
  @IsCpf({ message: 'It is required to send a valid cpf value' })
  public cpf?: string

  @ApiPropertyOptional()
  @IsOptional()
  @IsString({ message: DefaultValidationMessages.IsString })
  @IsPhoneNumber('BR', {
    message: 'It is required to send a valid phone number'
  })
  public phone?: string
}
