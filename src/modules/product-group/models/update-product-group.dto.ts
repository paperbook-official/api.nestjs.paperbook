import { ApiPropertyOptional } from '@nestjs/swagger'

import { IsNumber, IsOptional, Min } from 'class-validator'
import { DefaultValidationMessages } from 'src/models/enums/default-validation-messages.enum'

/**
 * The app's main update product group dto class
 *
 * Class that handles the dto sent by the user to perform the update
 */
export class UpdateProductGroupDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber(
    { maxDecimalPlaces: 0 },
    { message: DefaultValidationMessages.IsNumber }
  )
  @Min(1)
  public amount?: number
}
