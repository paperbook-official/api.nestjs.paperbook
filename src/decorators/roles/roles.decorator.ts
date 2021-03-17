import { CustomDecorator, SetMetadata } from '@nestjs/common'

import { RolesEnum } from 'src/models/enums/roles.enum'

/**
 * Decorator that is used to set all the roles that is allowed access some route
 * @param roles stores the roles values
 */
export const Roles = (...roles: RolesEnum[]): CustomDecorator<string> =>
  SetMetadata('roles', roles)
