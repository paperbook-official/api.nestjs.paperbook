import { ApiProperty } from '@nestjs/swagger'

/**
 * The app's main token proxy class
 *
 * Class that deals with the authentication return data
 */
export class TokenProxy {
  @ApiProperty()
  public token: string

  @ApiProperty()
  public expiresIn: string
}
