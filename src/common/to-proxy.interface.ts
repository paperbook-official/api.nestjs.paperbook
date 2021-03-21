/**
 * Interface that is used to convert some entity to proxy
 */
export interface ToProxy<TProxy> {
  /**
   * Method that converts the entity to you proxy
   * @returns the proxy data
   */
  toProxy(...params: unknown[]): TProxy
}
