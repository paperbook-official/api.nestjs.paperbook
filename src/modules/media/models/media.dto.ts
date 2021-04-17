import { ApiProperty } from '@nestjs/swagger'

/**
 * The app's main media dto class
 *
 * Class that deals with the media return data
 */
export class MediaDto {
  @ApiProperty()
  public url: string
}
