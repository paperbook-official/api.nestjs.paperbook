import { ConflictException, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { CrudRequest } from '@nestjsx/crud'
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm'
import { Repository } from 'typeorm'

import { EntityAlreadyDisabledException } from 'src/exceptions/conflict/entity-already-disabled.exception'
import { EntityAlreadyEnabledException } from 'src/exceptions/conflict/entity-already-enabled.exception'
import { ForbiddenException } from 'src/exceptions/forbidden/forbidden.exception'
import { EntityNotFoundException } from 'src/exceptions/not-found/entity-not-found.exception'

import { UserEntity } from '../entities/user.entity'

import { CreateUserDto } from '../models/create-user.dto'
import { UpdateUserDto } from '../models/update-user.dto'
import { RolesEnum } from 'src/models/enums/roles.enum'

import { PasswordService } from 'src/modules/password/services/password.service'

/**
 * The app's main user service class
 *
 * Class that deals with the users data
 */
@Injectable()
export class UserService extends TypeOrmCrudService<UserEntity> {
  public constructor(
    @InjectRepository(UserEntity)
    repository: Repository<UserEntity>,
    private readonly passwordService: PasswordService,
  ) {
    super(repository)
  }

  /**
   * Method that can save some entity in the database
   * @param createUserPayload stores the new user data
   * @returns the created user entity
   */
  public async create(createUserPayload: CreateUserDto): Promise<UserEntity> {
    const entity = new UserEntity(createUserPayload)

    entity.password = await this.passwordService.encryptPassword(
      entity.password,
    )
    entity.roles = entity.roles ?? RolesEnum.Common

    return await entity.save()
  }

  /**
   * Method that can get one user entity
   *
   * @param userId stores the target user id
   * @param requestUser stores the logged user data
   * @param crudRequest stores the joins, filters, etc
   * permission to execute this action
   * @throws {EntityNotFoundException} if the user was not found
   * @throws {ForbiddenException} if the request user has no permission
   * to access those sources
   * @returns the found user entity
   */
  public async listOne(
    userId: number,
    requestUser: UserEntity,
    crudRequest?: CrudRequest,
  ): Promise<UserEntity> {
    let entity: UserEntity

    if (crudRequest) {
      crudRequest.parsed.search = {
        $and: [
          ...crudRequest.parsed.search.$and,
          {
            id: {
              $eq: userId,
            },
          },
        ],
      }
      entity = await super.getOne(crudRequest).catch(() => undefined)
    } else {
      entity = await UserEntity.findOne({ id: userId })
    }

    if (!entity || !entity.isActive) {
      throw new EntityNotFoundException(userId)
    }

    if (!UserService.hasPermissions(entity.id, requestUser)) {
      throw new ForbiddenException()
    }

    return entity
  }

  /**
   * Method that can update some user
   *
   * @param userId stores the target user id
   * @param requestUser stores the logged user data
   * @param updatedUserPayload stores the new user data
   * @throws {EntityNotFoundException} if the user was not found
   * @throws {ForbiddenException} if the request user has no permission
   * to execute this action
   */
  public async update(
    userId: number,
    requestUser: UserEntity,
    updatedUserPayload: UpdateUserDto,
  ): Promise<void> {
    const entity = await UserEntity.findOne({ id: userId })

    if (!entity || !entity.isActive) {
      throw new EntityNotFoundException(userId)
    }

    if (!UserService.hasPermissions(entity.id, requestUser)) {
      throw new ForbiddenException()
    }

    await UserEntity.update({ id: userId }, updatedUserPayload)
  }

  /**
   * Method can delete some user
   *
   * @param userId stores the target user id
   * @param requestUser stores the logged user data
   * permission to execute this action
   * @throws {EntityNotFoundException} if the user was not found
   * @throws {ForbiddenException} if the request user has no permission
   * to access those sources
   */
  public async delete(userId: number, requestUser: UserEntity): Promise<void> {
    const entity = await UserEntity.findOne({ id: userId })

    if (!entity || !entity.isActive) {
      throw new EntityNotFoundException(userId)
    }

    if (!UserService.hasPermissions(entity.id, requestUser)) {
      throw new ForbiddenException()
    }
    await UserEntity.delete({ id: userId })
  }

  /**
   * Method that can disable some user
   *
   * @param userId stores the target user id
   * @param requestUser stores the logged user data
   * permission to execute this action
   * @throws {EntityNotFoundException} if the user was not found
   * @throws {ForbiddenException} if the request user has no permission
   * to access those sources
   * @throws {EntityAlreadyDisabledException} if the user is already disabled
   */
  public async disable(userId: number, requestUser: UserEntity): Promise<void> {
    const entity = await UserEntity.findOne({ id: userId })

    if (!entity) {
      throw new EntityNotFoundException(userId)
    }

    if (!entity.isActive) {
      throw new EntityAlreadyDisabledException(userId, UserEntity)
    }

    if (!UserService.hasPermissions(entity.id, requestUser)) {
      throw new ForbiddenException()
    }

    await UserEntity.update({ id: userId }, { isActive: false })
  }

  /**
   * Method that can enable some user
   *
   * @param userId stores the target user id
   * @param requestUser stores the logged user data
   * permission to execute this action
   * @throws {EntityNotFoundException} if the user was not found
   * @throws {ForbiddenException} if the request user has no permission
   * to access those sources
   * @throws {EntityAlreadyEnabledException} if the user is already enabled
   */
  public async enable(userId: number, requestUser: UserEntity): Promise<void> {
    const entity = await UserEntity.findOne({ id: userId })

    if (!entity) {
      throw new EntityNotFoundException(userId)
    }

    if (entity.isActive) {
      throw new EntityAlreadyEnabledException(userId, UserEntity)
    }

    if (!UserService.hasPermissions(entity.id, requestUser)) {
      throw new ForbiddenException()
    }

    await UserEntity.update({ id: userId }, { isActive: true })
  }

  /**
   * Method that changes the user roles from "*" to "seller"
   *
   * @param userId stores the user id
   * @param requestUser stores the logged user data
   * @throws {EntityNotFoundException} if the user was not found
   * @throws {ForbiddenException} if the request user has no permission
   * to access those sources
   * @throws {ConflictException} if user already has the seller role
   */
  public async modifyUserRolesToSeller(
    userId: number,
    requestUser: UserEntity,
  ): Promise<void> {
    const entity = await UserEntity.findOne({ id: userId })

    if (!entity || !entity.isActive) {
      throw new EntityNotFoundException(userId)
    }

    if (!UserService.hasPermissions(entity.id, requestUser)) {
      throw new ForbiddenException()
    }

    if (entity.roles.includes(RolesEnum.Seller)) {
      throw new ConflictException(
        `The entity identified by "${entity.id}" of type "${UserEntity.name}" has already the seller role`,
      )
    }

    await UserEntity.update({ id: userId }, { roles: RolesEnum.Seller })
  }

  /**
   * Method that changes the user roles from "*" to "common"
   *
   * @param userId stores the user id
   * @param requestUser stores the logged user data
   * @throws {EntityNotFoundException} if the user was not found
   * @throws {ForbiddenException} if the request user has no permission
   * to access those sources
   * @throws {ConflictException} if user already has the common role
   */
  public async modifyUserRolesToCommon(
    userId: number,
    requestUser: UserEntity,
  ): Promise<void> {
    const entity = await UserEntity.findOne({ id: userId })

    if (!entity || !entity.isActive) {
      throw new EntityNotFoundException(userId)
    }

    if (!UserService.hasPermissions(entity.id, requestUser)) {
      throw new ForbiddenException()
    }

    if (entity.roles.includes(RolesEnum.Common)) {
      throw new ConflictException(
        `The entity identified by "${entity.id}" of type "${UserEntity.name}" has already the common role`,
      )
    }

    await UserEntity.update({ id: userId }, { roles: RolesEnum.Common })
  }

  //#region Utils

  /**
   * Method that validates if the user can access some source
   *
   * @param userId stores the found entity
   * @param requestUser stores the logged user
   * @returns true if the user can access some source, otherwise false
   */
  public static hasPermissions(
    userId: number,
    requestUser: UserEntity,
  ): boolean {
    return userId === requestUser.id || this.isAdminUser(requestUser)
  }

  /**
   * Method that can test if the request user has the type "ADMIM"
   *
   * @param requestUser stores the user basic data
   */
  public static isAdminUser(requestUser: UserEntity): boolean {
    return (
      requestUser &&
      requestUser.roles &&
      this.hasRole(requestUser.roles, RolesEnum.Admin)
    )
  }

  /**
   * Method that can compare roles
   *
   * @param roles stores the roles that will be compared
   * @param targetRoles stores one or more roles that will be compared as well
   */
  public static hasRole(roles: string, targetRoles: string): boolean {
    return (
      roles &&
      roles.length !== 0 &&
      roles.split('|').some(role => targetRoles.includes(role))
    )
  }

  //#endregion
}
