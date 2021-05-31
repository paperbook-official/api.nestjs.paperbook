import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { Column, Entity, ManyToOne } from 'typeorm'

import { BaseEntity } from 'src/common/base.entity'
import { UserEntity } from 'src/modules/user/entities/user.entity'

import { AddressDto } from '../models/address.dto'
import { ToDto } from 'src/common/to-dto.interface'

/**
 * The app's main address entity class
 *
 * Class that represents the entity that deals with addresses
 */
@Entity('address')
export class AddressEntity extends BaseEntity implements ToDto<AddressDto> {
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
    nullable: true
  })
  public complement?: string

  @ApiProperty()
  @Column({
    type: 'varchar',
    length: 50,
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

  @ApiProperty()
  @Column({
    type: 'integer',
    nullable: false
  })
  public userId: number

  //#region Relations

  @ApiPropertyOptional({ type: () => UserEntity })
  @ManyToOne(
    () => UserEntity,
    user => user.addresses,
    {
      onDelete: 'CASCADE'
    }
  )
  public user?: UserEntity

  //#endregion

  //#endregion

  public constructor(partialEntity: Partial<AddressEntity>) {
    super()
    Object.assign(this, partialEntity)
  }

  /**
   * Method that converts the entity to you dto
   *
   * @returns the address entity dto
   */
  public toDto(): AddressDto {
    return new AddressDto(this)
  }
}
