import { BaseEntity } from 'typeorm/repository/BaseEntity'

import { RatingProxy } from '../models/rating.proxy'
import { ToProxy } from 'src/common/to-proxy.interface'

export class RatingEntity extends BaseEntity implements ToProxy<RatingProxy> {
  public constructor(partial: Partial<RatingEntity>) {
    super()
    Object.assign(this, partial)
  }

  public toProxy(): RatingProxy {
    return new RatingProxy(this)
  }
}
