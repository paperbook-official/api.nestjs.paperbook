import { ApiPropertyOptional } from '@nestjs/swagger'

import { IsOptional, IsNumber, IsString, Max, Min } from 'class-validator'
import { DefaultValidationMessages } from 'src/models/enums/default-validation-messages.enum'

/**
 * The app's main update rating payoad class
 *
 * Class that handles the payload sent by the user to perform the update
 */
export class UpdateRatingPayload {
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
}
