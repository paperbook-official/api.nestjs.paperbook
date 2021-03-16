import {
  BaseEntity as BaseEntityTypeOrm,
  CreateDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm'

/**
 * Abstract class that abstracts some useful properties
 */
export abstract class BaseEntity extends BaseEntityTypeOrm {
  @PrimaryGeneratedColumn()
  public id: number | string

  @CreateDateColumn()
  public createdAt: Date

  @UpdateDateColumn()
  public updatedAt: Date

  /**
   * Static method to validate if some entities exists in the database
   * @param ids stores the array of ids
   * @returns true if all the ids were found, otherwise false
   */
  public static async exists(...ids: (number | string)[]): Promise<boolean> {
    const entities = await this.findByIds(ids)
    return entities && entities.length !== ids.length
  }
}
