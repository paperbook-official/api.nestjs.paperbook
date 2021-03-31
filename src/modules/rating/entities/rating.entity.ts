import { Entity } from 'typeorm'

import { BaseEntity } from 'src/common/base.entity'

import { RatingProxy } from '../models/rating.proxy'
import { ToProxy } from 'src/common/to-proxy.interface'

/**
 * The app's main rating entity class
 *
 * Class that represents the entity that deals with rating
 */
@Entity('rating')
export class RatingEntity extends BaseEntity implements ToProxy<RatingProxy> {
  // #region

  // #endregion

  public constructor(partial: Partial<RatingEntity>) {
    super()
    Object.assign(this, partial)
  }

  /**
   * Method that converts the entity to your proxy
   * @returns the proxy data
   */
  public toProxy(): RatingProxy {
    return new RatingProxy(this)
  }
}
