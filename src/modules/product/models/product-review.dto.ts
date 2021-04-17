import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'

/**
 * The app's main product review dto class
 *
 * Class that deals with the product review return data
 */
export class ProductReviewDto {
  @ApiPropertyOptional()
  public five: number

  @ApiPropertyOptional()
  public four: number

  @ApiPropertyOptional()
  public three: number

  @ApiPropertyOptional()
  public two: number

  @ApiPropertyOptional()
  public one: number

  @ApiPropertyOptional()
  public zero: number

  @ApiProperty()
  public average: number

  @ApiProperty()
  public total: number
}
