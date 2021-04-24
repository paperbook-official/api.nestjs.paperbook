import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'

import { IsDefined, IsNumber, IsOptional, Min } from 'class-validator'
import { DefaultValidationMessages } from 'src/models/enums/default-validation-messages.enum'

/**
 * The app's main remove product group dto class
 *
 * Class that handles the dto sent by the user to perform the remove
 */
export class RemoveProductGroupDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber(
    { maxDecimalPlaces: 0 },
    { message: DefaultValidationMessages.IsNumber }
  )
  @Min(1)
  public amount?: number

  @ApiProperty()
  @IsDefined({ message: 'It is required to send the product id' })
  @IsNumber(
    { maxDecimalPlaces: 0 },
    { message: DefaultValidationMessages.IsNumber }
  )
  @Min(1)
  public productId: number
}
