import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'

import { ProductEntity } from '../entities/product.entity'

import { BaseGetManyDefaultResponseDto } from 'src/common/base-get-many-default-response.dto'
import { BaseResponseDto } from 'src/common/base-response.dto'
import { CategoryDto } from 'src/modules/category/models/category.dto'
import { ProductGroupDto } from 'src/modules/product-group/models/product-group.dto'
import { RatingDto } from 'src/modules/rating/models/rating.dto'
import { UserDto } from 'src/modules/user/models/user.dto'

/**
 * The app's main product dto class
 *
 * Class that deals with the product return data
 */
export class ProductDto extends BaseResponseDto {
  @ApiProperty()
  public imageUrl: string

  @ApiProperty()
  public name: string

  @ApiProperty()
  public description: string

  @ApiProperty()
  public price: number

  @ApiProperty()
  public installmentPrice: number

  @ApiProperty()
  public installmentAmount: number

  @ApiProperty()
  public discount: number

  @ApiProperty()
  public stockAmount: number

  @ApiProperty()
  public ordersAmount: number

  @ApiProperty()
  public userId: number

  @ApiPropertyOptional({
    type: () => UserDto,
  })
  public user?: UserDto

  @ApiPropertyOptional({
    type: () => CategoryDto,
    isArray: true,
  })
  public categories?: CategoryDto[]

  @ApiPropertyOptional({
    type: () => RatingDto,
    isArray: true,
  })
  public ratings?: RatingDto[]

  @ApiPropertyOptional({
    type: () => ProductGroupDto,
    isArray: true,
  })
  public productGroups?: ProductGroupDto[]

  public constructor(entity: ProductEntity) {
    super(entity)

    this.imageUrl = entity.imageUrl
    this.name = entity.name
    this.description = entity.description
    this.price = entity.price
    this.installmentPrice = entity.installmentPrice
    this.installmentAmount = entity.installmentAmount
    this.discount = entity.discount
    this.stockAmount = entity.stockAmount
    this.ordersAmount = entity.ordersAmount
    this.userId = entity.userId

    // relations
    this.user = entity.user?.toDto()
    this.categories = entity.categories?.map(productCategory =>
      productCategory.toDto(),
    )
    this.ratings = entity.ratings?.map(rating => rating.toDto())
    this.productGroups = entity.productGroups?.map(shoppingCart =>
      shoppingCart.toDto(),
    )
  }
}

/**
 * The app's main get many product dto response
 *
 * Class that deals with the products return data with pagination
 */
export class GetManyProductDtoResponse extends BaseGetManyDefaultResponseDto {
  @ApiProperty({ type: ProductDto, isArray: true })
  data: ProductDto[]
}
