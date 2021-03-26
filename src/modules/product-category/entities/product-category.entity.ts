import { BaseEntity } from 'src/common/base.entity'

import { ProductCategoryProxy } from '../models/product-category.proxy'
import { ToProxy } from 'src/common/to-proxy.interface'

export class ProductCategoryEntity extends BaseEntity
  implements ToProxy<ProductCategoryProxy> {
  public toProxy(): ProductCategoryProxy {
    return new ProductCategoryProxy(this)
  }
}
