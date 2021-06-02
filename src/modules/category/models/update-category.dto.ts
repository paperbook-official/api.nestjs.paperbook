import { ApiPropertyOptional } from '@nestjs/swagger'

import { DefaultValidationMessages } from 'src/models/enums/default-validation-messages.enum'

import { IsOptional, IsString } from 'class-validator'

/**
 * The app's main update category dto class
 *
 * Class that handles the dto sent by the user to perform the update
 */
export class UpdatedCategoryDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString({ message: DefaultValidationMessages.IsString })
  public name?: string
}
