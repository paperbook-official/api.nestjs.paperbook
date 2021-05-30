import { ApiPropertyOptional } from '@nestjs/swagger'

import {
  IsNumber,
  IsNumberString,
  IsOptional,
  IsString,
  Length
} from 'class-validator'
import { DefaultValidationMessages } from 'src/models/enums/default-validation-messages.enum'

/**
 * The app's main update address dto class
 *
 * Class that handles the dto sent by the user to perform the update
 */
export class UpdatedAddressDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsNumberString({}, { message: 'It is required to send a numeric string' })
  @Length(8)
  public cep?: string

  @ApiPropertyOptional()
  @IsOptional()
  @IsString({ message: DefaultValidationMessages.IsString })
  public street?: string

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 0 })
  public houseNumber?: number

  @ApiPropertyOptional()
  @IsOptional()
  @IsString({ message: DefaultValidationMessages.IsString })
  public complement?: string

  @ApiPropertyOptional()
  @IsOptional()
  @IsString({ message: DefaultValidationMessages.IsString })
  public district?: string

  @ApiPropertyOptional()
  @IsOptional()
  @IsString({ message: DefaultValidationMessages.IsString })
  public city?: string

  @ApiPropertyOptional()
  @IsOptional()
  @IsString({ message: DefaultValidationMessages.IsString })
  @Length(2)
  public state?: string
}
