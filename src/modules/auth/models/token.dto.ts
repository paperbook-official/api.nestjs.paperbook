import { ApiProperty } from '@nestjs/swagger'

/**
 * The app's main token dto class
 *
 * Class that deals with the authentication return data
 */
export class TokenDto {
  @ApiProperty()
  public token: string

  @ApiProperty()
  public expiresIn: string
}
