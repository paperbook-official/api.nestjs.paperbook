import { ApiProperty } from '@nestjs/swagger'

/**
 * The app's main get many default response base class
 *
 * Class that deals with the paginated response in the app
 */
export abstract class BaseGetManyDefaultResponse<T> {
  @ApiProperty()
  public count: number

  @ApiProperty()
  public total: number

  @ApiProperty()
  public page: number

  @ApiProperty()
  public pageCount: number
}
