import { ProductCategoryEntity } from '../entities/product-category.entity'

import { BaseProxy } from 'src/common/base.proxy'

export class ProductCategoryProxy extends BaseProxy {
  public constructor(entity: ProductCategoryEntity) {
    super(entity)
  }
}
