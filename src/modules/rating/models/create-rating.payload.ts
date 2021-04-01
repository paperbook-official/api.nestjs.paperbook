import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'

import { IsNumber, IsOptional } from 'class-validator'
import { DefaultValidationMessages } from 'src/models/enums/default-validation-messages.enum'

/**
 * The app's main create rating payload class
 *
 * Class that handles the payload sent by the user to perform the create
 */
export class CreateRatingPayload {
  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber(
    { maxDecimalPlaces: 0 },
    { message: DefaultValidationMessages.IsNumber }
  )
  public five?: number

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber(
    { maxDecimalPlaces: 0 },
    { message: DefaultValidationMessages.IsNumber }
  )
  public four?: number

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber(
    { maxDecimalPlaces: 0 },
    { message: DefaultValidationMessages.IsNumber }
  )
  public three?: number

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber(
    { maxDecimalPlaces: 0 },
    { message: DefaultValidationMessages.IsNumber }
  )
  public two?: number

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber(
    { maxDecimalPlaces: 0 },
    { message: DefaultValidationMessages.IsNumber }
  )
  public one?: number

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber(
    { maxDecimalPlaces: 0 },
    { message: DefaultValidationMessages.IsNumber }
  )
  public zero?: number
  @ApiProperty()
  @IsOptional()
  @IsNumber(
    { maxDecimalPlaces: 0 },
    { message: DefaultValidationMessages.IsNumber }
  )
  public productId: number
}
