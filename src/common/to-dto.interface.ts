/**
 * Interface that is used to convert some entity to dto
 */
export interface ToDto<TDto> {
  /**
   * Method that converts the entity to you dto
   * @returns the dto data
   */
  toDto(...params: unknown[]): TDto
}
