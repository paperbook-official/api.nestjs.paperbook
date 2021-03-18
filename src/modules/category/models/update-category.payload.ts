import { ApiPropertyOptional } from '@nestjs/swagger'

import {
  IsOptional,
  IsString,
} from 'class-validator'
import { DefaultValidationMessages } from 'src/models/enums/default-validation-messages.enum'


export class UpdatedCategoryPayload {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString({ message: DefaultValidationMessages.IsString })
  public name: string
}
