import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'

import {
  IsArray,
  IsDefined,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min
} from 'class-validator'
import { DefaultValidationMessages } from 'src/models/enums/default-validation-messages.enum'

/**
 * The app's main create product dto class
 *
 * Class that handles the dto sent by the user to perform the creation
 */
export class CreateProductDto {
  @ApiProperty()
  @IsDefined({ message: 'It is required to send the image url' })
  @IsString({ message: DefaultValidationMessages.IsString })
  @IsNotEmpty({ message: DefaultValidationMessages.IsNotEmpty })
  public imageUrl: string

  @ApiProperty()
  @IsDefined({ message: 'It is required to send the name' })
  @IsString({ message: DefaultValidationMessages.IsString })
  @IsNotEmpty({ message: DefaultValidationMessages.IsNotEmpty })
  public name: string

  @ApiProperty()
  @IsDefined({ message: 'It is required to send the description' })
  @IsString({ message: DefaultValidationMessages.IsString })
  public description: string

  @ApiProperty()
  @IsDefined({ message: 'It is required to send the price' })
  @IsNumber({}, { message: DefaultValidationMessages.IsNumber })
  @Min(0)
  public price: number

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
  @Min(1)
  public installmentAmount?: number

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber({}, { message: DefaultValidationMessages.IsNumber })
  @Max(1)
  @Min(0)
  public discount?: number

  @ApiProperty()
  @IsDefined({ message: 'It is required to send the full price' })
  @IsNumber(
    { maxDecimalPlaces: 0 },
    { message: DefaultValidationMessages.IsNumber }
  )
  @Min(1)
  public stockAmount: number

  @ApiProperty()
  @IsDefined({ message: 'It is required to send the user id' })
  @IsNumber(
    { maxDecimalPlaces: 0 },
    { message: DefaultValidationMessages.IsNumber }
  )
  public userId: number

  @ApiPropertyOptional()
  @IsOptional()
  @IsArray({ message: 'It is required to send a valid array' })
  public categoryIds: number[]
}
