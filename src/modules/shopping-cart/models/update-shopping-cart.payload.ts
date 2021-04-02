import { ApiPropertyOptional } from '@nestjs/swagger'

import { IsNumber, IsOptional, Min } from 'class-validator'
import { DefaultValidationMessages } from 'src/models/enums/default-validation-messages.enum'

/**
 * The app's main update shopping cart payload class
 *
 * Class that handles the payload sent by the user to perform the update
 */
export class UpdateShoppingCartPayload {
  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber(
    { maxDecimalPlaces: 0 },
    { message: DefaultValidationMessages.IsNumber }
  )
  @Min(0)
  public productId: number

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber(
    { maxDecimalPlaces: 0 },
    { message: DefaultValidationMessages.IsNumber }
  )
  @Min(0)
  public userId: number
}
