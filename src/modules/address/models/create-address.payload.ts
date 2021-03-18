import { ApiProperty } from '@nestjs/swagger'

import {
  IsDefined,
  IsNumber,
  IsNumberString,
  IsString,
  Length
} from 'class-validator'
import { DefaultValidationMessages } from 'src/models/enums/default-validation-messages.enum'

/**
 * The app's main create address payload class
 *
 * Class that handles the payload sent by the user to perform the create
 */
export class CreateAddressPayload {
  @ApiProperty()
  @IsDefined({ message: 'It is required to send the cep' })
  @IsNumberString({}, { message: 'It is required to send a numeric string' })
  @Length(8)
  public cep: string

  @ApiProperty()
  @IsDefined({ message: 'It is required to send the street' })
  @IsString({ message: DefaultValidationMessages.IsString })
  public street: string

  @ApiProperty()
  @IsDefined({ message: 'It is required to send the house number' })
  @IsNumber({ maxDecimalPlaces: 0 })
  public houseNumber: number

  @ApiProperty()
  @IsDefined({ message: 'It is required to send the complement' })
  @IsString({ message: DefaultValidationMessages.IsString })
  public complement: string

  @ApiProperty()
  @IsDefined({ message: 'It is required to send the district' })
  @IsString({ message: DefaultValidationMessages.IsString })
  public district: string

  @ApiProperty()
  @IsDefined({ message: 'It is required to send the city' })
  @IsString({ message: DefaultValidationMessages.IsString })
  public city: string

  @ApiProperty()
  @IsDefined({ message: 'It is required to send the state' })
  @IsString({ message: DefaultValidationMessages.IsString })
  @Length(2)
  public state: string

  @ApiProperty()
  @IsDefined({ message: 'It is required to send the user id' })
  @IsNumber(
    { maxDecimalPlaces: 0 },
    { message: DefaultValidationMessages.IsNumber }
  )
  public userId: number
}
