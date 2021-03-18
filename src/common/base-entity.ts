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

  /**
   * Static method to validate if some entities exists in the database
   * @param ids stores the array of ids
   * @returns true if all the ids were found, otherwise false
   */
  public static async exists(...ids: (number | string)[]): Promise<boolean> {
    const entities = await this.findByIds(ids).then(entities =>
      entities.filter(entity => entity.isActive)
    )

    return entities && entities.length !== ids.length
  }
}
