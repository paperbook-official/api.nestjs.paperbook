import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'

import {
  IsDefined,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min
} from 'class-validator'
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
  @Min(0)
  @Max(5)
  public stars?: number

  @ApiPropertyOptional()
  @IsOptional()
  @IsString({ message: DefaultValidationMessages.IsString })
  public text?: string

  @ApiProperty()
  @IsDefined({ message: 'It is required to send the user id' })
  @IsNumber(
    { maxDecimalPlaces: 0 },
    { message: DefaultValidationMessages.IsNumber }
  )
  public userId?: number

  @ApiProperty()
  @IsDefined({ message: 'It is required to send the product id' })
  @IsNumber(
    { maxDecimalPlaces: 0 },
    { message: DefaultValidationMessages.IsNumber }
  )
  public productId?: number
}
