import { CustomDecorator, SetMetadata } from '@nestjs/common'

/**
 * Decorator that is used to set all the roles that is allowed access some route
 * @param roles stores the roles values
 */
export const Roles = (
  ...roles: ('user' | 'admin')[]
): ((
  metadataKey: string,
  metadataValue: string[]
) => CustomDecorator<string>) => SetMetadata('roles', roles)
