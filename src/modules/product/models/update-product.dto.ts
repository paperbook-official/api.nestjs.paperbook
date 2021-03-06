import { ApiPropertyOptional } from '@nestjs/swagger'

import { DefaultValidationMessages } from 'src/models/enums/default-validation-messages.enum'

import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator'

/**
 * The app's main create product dto class
 *
 * Class that handles the dto sent by the user peform the update
 */
export class UpdateProductDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString({ message: DefaultValidationMessages.IsString })
  @IsNotEmpty({ message: DefaultValidationMessages.IsString })
  public imageUrl?: string

  @ApiPropertyOptional()
  @IsOptional()
  @IsString({ message: DefaultValidationMessages.IsString })
  @IsNotEmpty({ message: DefaultValidationMessages.IsString })
  public name?: string

  @ApiPropertyOptional()
  @IsOptional({ message: 'It is required to send the description' })
  @IsString({ message: DefaultValidationMessages.IsString })
  public description?: string

  @ApiPropertyOptional()
  @IsOptional({ message: 'It is required to send the full price' })
  @IsNumber({}, { message: DefaultValidationMessages.IsNumber })
  @Min(0)
  public price?: number

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber({}, { message: DefaultValidationMessages.IsNumber })
  @Min(0)
  public installmentPrice?: number

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber(
    { maxDecimalPlaces: 0 },
    { message: DefaultValidationMessages.IsNumber },
  )
  @Min(0)
  public installmentAmount?: number

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber({}, { message: DefaultValidationMessages.IsNumber })
  @Max(1)
  @Min(0)
  public discount?: number

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber(
    { maxDecimalPlaces: 0 },
    { message: DefaultValidationMessages.IsNumber },
  )
  @Min(1)
  public stockAmount?: number

  @ApiPropertyOptional()
  @IsOptional()
  @IsArray({ message: 'It is required to send a valid array' })
  public categoryIds: number[]
}
