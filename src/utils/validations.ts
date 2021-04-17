import { UserEntity } from 'src/modules/user/entities/user.entity'

import { RolesEnum } from 'src/models/enums/roles.enum'

/**
 * Function that can test if the request user has the type "ADMIM"
 * @param requestUser stores the user basic data
 */
export function isAdminUser(requestUser: UserEntity): boolean {
  return (
    requestUser &&
    requestUser.roles &&
    hasRole(requestUser.roles, RolesEnum.Admin)
  )
}

/**
 * Function that can compare roles
 * @param roles stores the roles that will be compared
 * @param targetRoles stores one or more roles that will be compared as well
 */
export function hasRole(roles: string, targetRoles: string): boolean {
  return (
    roles &&
    roles.length !== 0 &&
    roles.split('|').some(role => targetRoles.includes(role))
  )
}
