import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  UnauthorizedException
} from '@nestjs/common'
import { Reflector } from '@nestjs/core'

import { RequestUser } from 'src/utils/type.shared'

/**
 * The app's main roles guard class
 *
 * Guard that protects some route testing the roles saved in the metadata
 */
export class RolesGuard implements CanActivate {
  public canActivate(context: ExecutionContext): boolean {
    const roles = new Reflector().get<string[]>('roles', context.getHandler())

    if (!roles) return true

    const user: RequestUser = context.switchToHttp().getRequest().user

    if (!user)
      throw new UnauthorizedException(
        'You have no permission to access those sources'
      )

    const hasRole = user.roles.split('|').some(role => roles.includes(role))

    if (user.roles && hasRole) return true

    throw new ForbiddenException(
      'You have no permission to access those sources'
    )
  }
}
