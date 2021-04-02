import { BaseEntity } from 'src/common/base.entity'

import { ShoppingCartProxy } from '../models/shopping-cart.proxy'
import { ToProxy } from 'src/common/to-proxy.interface'

export class ShoppingCartEntity extends BaseEntity
  implements ToProxy<ShoppingCartProxy> {
  public constructor(partial: Partial<ShoppingCartEntity>) {
    super()
    Object.assign(this, partial)
  }

  public toProxy(): ShoppingCartProxy {
    return null
  }
}
