import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { Column, Entity, ManyToOne } from 'typeorm'

import { BaseEntity } from 'src/common/base-entity'
import { UserEntity } from 'src/modules/user/entities/user.entity'

import { AddressProxy } from '../models/address.proxy'
import { ToProxy } from 'src/common/to-proxy'

/**
 * The app's main address entity class
 *
 * Class that represents the entity that deals with addresses
 */
@Entity('addresses')
export class AddressEntity extends BaseEntity implements ToProxy<AddressProxy> {
  //#region Columns

  @ApiProperty()
  @Column({
    type: 'varchar',
    length: 8,
    nullable: false
  })
  public cep: string

  @ApiProperty()
  @Column({
    type: 'varchar',
    length: 50,
    nullable: false
  })
  public street: string

  @ApiProperty()
  @Column({
    type: 'int',
    nullable: false
  })
  public houseNumber: number

  @ApiProperty()
  @Column({
    type: 'text',
    nullable: false
  })
  public complement: string

  @ApiProperty()
  @Column({
    type: 'varchar',
    length: 30,
    nullable: false
  })
  public district: string

  @ApiProperty()
  @Column({
    type: 'varchar',
    length: 50,
    nullable: false
  })
  public city: string

  @ApiProperty()
  @Column({
    type: 'varchar',
    length: 2,
    nullable: false
  })
  public state: string

  @Column({
    type: 'integer',
    nullable: false
  })
  public userId: number

  //#region Relations

  @ApiPropertyOptional()
  @ManyToOne(
    () => UserEntity,
    user => user.addresses
  )
  public user?: UserEntity

  //#endregion

  //#endregion

  public constructor(partialEntity: Partial<AddressEntity>) {
    super()
    Object.assign(this, partialEntity)
  }

  /**
   * Method that converts the entity to you proxy
   * @returns the proxy data
   */
  public toProxy(): AddressProxy {
    return new AddressProxy(this)
  }
}
