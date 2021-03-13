import { ApiPropertyOptional } from '@nestjs/swagger'

import { IsOptional, IsString } from 'class-validator'
import { DefaultValidationMessages } from 'src/models/default-validation-messages'

/**
 * The app's main update user payload class
 *
 * Class that handles the payload sent by the user to perform the update
 */
export class UpdateUserPaylaod {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString({ message: DefaultValidationMessages.IsString })
  public name: string
}
