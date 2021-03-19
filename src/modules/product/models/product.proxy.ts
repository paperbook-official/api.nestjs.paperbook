import { ApiProperty } from '@nestjs/swagger'

import { ProductEntity } from '../entities/product.entity'

import { BaseProxy } from 'src/common/base-proxy'

/**
 * The app's main product proxy class
 *
 * Class that deals with the product return data
 */
export class ProductProxy extends BaseProxy {
  @ApiProperty()
  public name: string

  @ApiProperty()
  public description: string

  @ApiProperty()
  public fullPrice: number

  @ApiProperty()
  public installmentPrice: number

  @ApiProperty()
  public installmentAmount: number

  @ApiProperty()
  public discountAmount: number

  @ApiProperty()
  public stockAmount: number

  public constructor(productEntity: ProductEntity) {
    super(productEntity)

    this.name = productEntity.name
    this.description = productEntity.description
    this.fullPrice = productEntity.fullPrice
    this.installmentPrice = productEntity.installmentPrice
    this.installmentAmount = productEntity.installmentAmount
    this.discountAmount = productEntity.discountAmount
    this.stockAmount = productEntity.stockAmount
  }
}
