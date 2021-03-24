import { ApiProperty } from '@nestjs/swagger'

/**
 * The app's main media proxy class
 *
 * Class that deals with the media return data
 */
export class MediaProxy {
  @ApiProperty()
  public url: string
}
