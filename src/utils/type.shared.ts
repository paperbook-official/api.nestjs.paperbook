/**
 * Interface that abstracts the request user properties
 */
export interface RequestUser {
  readonly id: number
  readonly email: string
  readonly roles: string
}
