import { ApiPropertyOptional } from '@nestjs/swagger'

import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min
} from 'class-validator'
import { DefaultValidationMessages } from 'src/models/enums/default-validation-messages.enum'

/**
 * The app's main create product payload class
 *
 * Class that handles the payload sent by the user peform the update
 */
export class UpdateProductPayload {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString({ message: DefaultValidationMessages.IsString })
  @IsNotEmpty({ message: DefaultValidationMessages.IsString })
  public imageUrl: string

  @ApiPropertyOptional()
  @IsOptional()
  @IsString({ message: DefaultValidationMessages.IsString })
  @IsNotEmpty({ message: DefaultValidationMessages.IsString })
  public name: string

  @ApiPropertyOptional()
  @IsOptional({ message: 'It is required to send the description' })
  @IsString({ message: DefaultValidationMessages.IsString })
  public description: string

  @ApiPropertyOptional()
  @IsOptional({ message: 'It is required to send the full price' })
  @IsNumber({}, { message: DefaultValidationMessages.IsNumber })
  @Min(0)
  public fullPrice: number

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber({}, { message: DefaultValidationMessages.IsNumber })
  @Min(0)
  public installmentPrice?: number

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber(
    { maxDecimalPlaces: 0 },
    { message: DefaultValidationMessages.IsNumber }
  )
  @Min(0)
  public installmentAmount?: number

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber({}, { message: DefaultValidationMessages.IsNumber })
  @Max(1)
  @Min(0)
  public discountAmount?: number

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber(
    { maxDecimalPlaces: 0 },
    { message: DefaultValidationMessages.IsNumber }
  )
  @Min(1)
  public stockAmount: number
}
