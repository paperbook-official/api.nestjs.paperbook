import {
  CanActivate,
  ExecutionContext,
  Logger,
  UnauthorizedException
} from '@nestjs/common'
import { Reflector } from '@nestjs/core'

import { UserEntity } from 'src/modules/user/entities/user.entity'

import { ForbiddenException } from 'src/exceptions/forbidden/forbidden.exception'

/**
 * The app's main roles guard class
 *
 * Guard that protects some route testing the roles saved in the metadata
 */
export class RolesGuard implements CanActivate {
  public canActivate(context: ExecutionContext): boolean {
    const roles = new Reflector().get<string[]>('roles', context.getHandler())

    if (!roles) return true

    const user: UserEntity = context.switchToHttp().getRequest().user

    Logger.log(user)

    if (!user)
      throw new UnauthorizedException(
        'You have no permission to access those sources'
      )

    Logger.log(user.roles)

    const hasRole = user.roles.split('|').some(role => roles.includes(role))

    Logger.log(hasRole)

    if (user.roles && hasRole) return true

    throw new ForbiddenException()
  }
}
