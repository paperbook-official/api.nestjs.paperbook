import { ApiProperty } from '@nestjs/swagger'

import { IsDefined, IsNumber } from 'class-validator'
import { DefaultValidationMessages } from 'src/models/enums/default-validation-messages.enum'

/**
 * The app's main create product category payload class
 *
 * Class that handles the payload sent by the user to perform the creation
 */
export class CreateProductCategoryPayload {
  @ApiProperty()
  @IsDefined({ message: 'It is required to send the product id' })
  @IsNumber(
    { maxDecimalPlaces: 0 },
    { message: DefaultValidationMessages.IsNumber }
  )
  public productId: number

  @ApiProperty()
  @IsDefined({ message: 'It is required to send the category id' })
  @IsNumber(
    { maxDecimalPlaces: 0 },
    { message: DefaultValidationMessages.IsNumber }
  )
  public categoryId: number
}
