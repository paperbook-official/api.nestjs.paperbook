import { ApiPropertyOptional } from '@nestjs/swagger'

import { IsNumber, IsOptional } from 'class-validator'
import { DefaultValidationMessages } from 'src/models/enums/default-validation-messages.enum'

/**
 * The app's main update product category class
 *
 * Class that handles the payload sent by the user to perform the update
 */
export class UpdateProductCategoryPayload {
  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber(
    { maxDecimalPlaces: 0 },
    { message: DefaultValidationMessages.IsNumber }
  )
  public productId?: number

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber(
    { maxDecimalPlaces: 0 },
    { message: DefaultValidationMessages.IsNumber }
  )
  public categoryId?: number
}
