import { CanActivate, ExecutionContext } from '@nestjs/common'
import { Reflector } from '@nestjs/core'

import { ForbiddenException } from 'src/exceptions/forbidden/forbidden.exception'

import { UserEntity } from 'src/modules/user/entities/user.entity'

/**
 * The app's main roles guard class
 *
 * Guard that protects some route testing the roles saved in the metadata
 */
export class RolesGuard implements CanActivate {
  /**
   * Method that is called before the route be accessed
   *
   * @param context stores the current execution context
   * @returns true if the can be accessed, otherwise false
   */
  public canActivate(context: ExecutionContext): boolean {
    const roles = new Reflector().get<string[]>('roles', context.getHandler())

    if (!roles) {
      return true
    }

    const user: UserEntity = context
      .switchToHttp()
      .getRequest<Request & { user: UserEntity }>().user

    if (!user) {
      throw new ForbiddenException()
    }

    const hasRole = user.roles.split('|').some(role => roles.includes(role))

    if (user.roles && hasRole) {
      return true
    }

    throw new ForbiddenException()
  }
}
