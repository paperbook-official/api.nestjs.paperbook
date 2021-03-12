/**
 * Interface that is used to convert some entity to proxy
 */
export interface ToProxy<TProxy> {
  toProxy(...params: unknown[]): TProxy
}
