import { CustomDecorator, SetMetadata } from '@nestjs/common'

/**
 * Decorator that is used to set all the roles that can access some route
 * @param roles stores the roles values
 */
export const Roles = (
  ...roles: string[]
): ((
  metadataKey: string,
  metadataValue: string[]
) => CustomDecorator<string>) => SetMetadata('roles', roles)
