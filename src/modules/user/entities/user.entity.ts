import { Column, Entity } from 'typeorm'

import { BaseEntity } from 'src/common/base-entity'

import { UserProxy } from '../models/user.proxy'
import { ToProxy } from 'src/common/to-proxy'

/**
 * The app's main user entity class
 *
 * Class that represents the entity that deals with users
 */
@Entity('user')
export class UserEntity extends BaseEntity implements ToProxy<UserProxy> {
  public constructor(partialEntity: Partial<UserEntity>) {
    super()
    Object.assign(this, partialEntity)
  }

  @Column({
    type: 'varchar',
    length: 50,
    nullable: false
  })
  public name: string

  @Column({
    type: 'varchar',
    length: 25,
    nullable: false,
    unique: true
  })
  public email: string

  @Column({
    type: 'varchar',
    length: 25,
    nullable: false
  })
  public password: string

  @Column({
    type: 'varchar',
    length: 10,
    nullable: false
  })
  public roles: string

  /**
   * Method that converts the entity to your proxy
   * @returns the proxy data
   */
  public toProxy(): UserProxy {
    return new UserProxy(this)
  }
}
