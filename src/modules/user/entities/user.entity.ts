import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { Column, Entity, OneToMany } from 'typeorm'

import { BaseEntity } from 'src/common/base-entity'
import { AddressEntity } from 'src/modules/address/entities/address.entity'
import { ProductEntity } from 'src/modules/product/entities/product.entity'

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
  //#region Columns

  @ApiProperty()
  @Column({
    type: 'varchar',
    length: 30,
    nullable: false
  })
  public name: string

  @ApiProperty()
  @Column({
    type: 'varchar',
    length: 60,
    nullable: false
  })
  public lastName: string

  @ApiProperty()
  @Column({
    type: 'varchar',
    length: 50,
    nullable: false,
    unique: true
  })
  public email: string

  @ApiProperty()
  @Column({
    type: 'varchar',
    length: 100,
    nullable: false
  })
  public password: string

  @ApiPropertyOptional()
  @Column({
    type: 'varchar',
    length: 11,
    nullable: true
  })
  public cpf?: string

  @ApiProperty()
  @Column({
    type: 'varchar',
    length: 12,
    nullable: false
  })
  public roles: RolesEnum

  @ApiPropertyOptional()
  @Column({
    type: 'varchar',
    length: 11,
    nullable: true
  })
  public phone?: string

  //#region Relations

  @ApiPropertyOptional()
  @OneToMany(
    () => AddressEntity,
    address => address.user
  )
  public addresses?: AddressEntity[]

  @ApiPropertyOptional()
  @OneToMany(
    () => ProductEntity,
    product => product.user
  )
  public products?: ProductEntity[]

  //#endregion

  //#endregion

  public constructor(partialEntity: Partial<UserEntity>) {
    super()
    Object.assign(this, partialEntity)
  }

  /**
   * Method that converts the entity to your proxy
   * @returns the proxy data
   */
  public toProxy(): UserProxy {
    return new UserProxy(this)
  }
}
