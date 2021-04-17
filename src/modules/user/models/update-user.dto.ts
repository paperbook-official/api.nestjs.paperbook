import { ApiPropertyOptional } from '@nestjs/swagger'

import { IsCpf } from 'src/decorators/is-cpf/is-cpf.decorator'

import { IsOptional, IsPhoneNumber, IsString } from 'class-validator'
import { DefaultValidationMessages } from 'src/models/enums/default-validation-messages.enum'

/**
 * The app's main update user dto class
 *
 * Class that handles the dto sent by the user to perform the update
 */
export class UpdateUserDto {
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
