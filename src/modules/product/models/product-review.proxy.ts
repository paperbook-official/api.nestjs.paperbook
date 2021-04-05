import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'

export class ProductReviewProxy {
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
