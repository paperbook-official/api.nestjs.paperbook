import {
  BaseEntity as BaseEntityTypeOrm,
  Column,
  CreateDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm'

/**
 * Abstract class that abstracts some useful properties
 */
export abstract class BaseEntity extends BaseEntityTypeOrm {
  @PrimaryGeneratedColumn()
  public id: number

  @CreateDateColumn()
  public createdAt: Date

  @UpdateDateColumn()
  public updatedAt: Date

  @Column({
    type: 'boolean',
    default: true
  })
  public isActive: boolean
}
