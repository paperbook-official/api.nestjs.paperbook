import { Column, Entity } from 'typeorm'

import { BaseEntity } from 'src/common/base-entity'

import { UserProxy } from '../models/user.proxy'
import { ToProxy } from 'src/common/to-proxy'

import { RolesEnum } from 'src/models/enums/roles.enum'

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
    length: 30,
    nullable: false
  })
  public name: string

  @Column({
    type: 'varchar',
    length: 60,
    nullable: false
  })
  public lastName: string

  @Column({
    type: 'varchar',
    length: 50,
    nullable: false,
    unique: true
  })
  public email: string

  @Column({
    type: 'varchar',
    length: 100,
    nullable: false
  })
  public password: string

  @Column({
    type: 'varchar',
    length: 11,
    nullable: false
  })
  public cpf: string

  @Column({
    type: 'varchar',
    length: 12,
    nullable: false
  })
  public roles: RolesEnum

  @Column({
    type: 'varchar',
    length: 11,
    nullable: false
  })
  public phone: string

  /**
   * Method that converts the entity to your proxy
   * @returns the proxy data
   */
  public toProxy(): UserProxy {
    return new UserProxy(this)
  }
}
