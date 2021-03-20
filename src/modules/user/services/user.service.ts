import {
  ConflictException,
  ForbiddenException,
  forwardRef,
  Inject,
  Injectable,
  NotFoundException
} from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { CrudRequest, GetManyDefaultResponse } from '@nestjsx/crud'
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm'
import { Repository } from 'typeorm'

import { UserEntity } from '../entities/user.entity'
import { AddressEntity } from 'src/modules/address/entities/address.entity'

import { CreateUserPayload } from '../models/create-user.payload'
import { UpdateUserPaylaod } from '../models/update-user.payload'

import { AddressService } from 'src/modules/address/services/address.service'

import { encryptPassword } from 'src/utils/password'
import { RequestUser } from 'src/utils/type.shared'
import { isAdminUser } from 'src/utils/validations'

import { RolesEnum } from 'src/models/enums/roles.enum'

/**
 * The app's main user service class
 *
 * Class that deals with the users data
 */
@Injectable()
export class UserService extends TypeOrmCrudService<UserEntity> {
  public constructor(
    @InjectRepository(UserEntity)
    private readonly repository: Repository<UserEntity>,
    @Inject(forwardRef(() => AddressService))
    private readonly addressService: AddressService
  ) {
    super(repository)
  }

  /**
   * Method that can save some entity in the database
   * @param createUserPayload stores the new user data
   * @returns the created user entity
   */
  public async create(
    createUserPayload: CreateUserPayload
  ): Promise<UserEntity> {
    const entity = new UserEntity(createUserPayload)

    entity.password = await encryptPassword(entity.password)
    entity.roles = entity.roles ?? RolesEnum.User

    return await entity.save()
  }

  /**
   * Method that can get one user entity
   * @param userId stores the target user id
   * @param requestUser stores the logged user data
   * @param crudRequest stores the joins, filters, etc
   * @throws {NotFoundException} if the user was not found
   * @throws {ForbiddenException} if the request user has no
   * permission to execute this action
   * @returns the found user entity
   */
  public async get(
    userId: number,
    requestUser: RequestUser,
    crudRequest?: CrudRequest
  ): Promise<UserEntity> {
    let entity: UserEntity

    if (crudRequest) {
      crudRequest.parsed.search = {
        $and: [...crudRequest.parsed.search.$and, { id: userId }]
      }
      entity = await super.getOne(crudRequest).catch(() => undefined)
    } else {
      entity = await UserEntity.findOne({ id: userId })
    }

    if (!entity || !entity.isActive) {
      throw new NotFoundException(
        `The entity identified by "${userId}" does not exist or is disabled`
      )
    }

    if (!this.hasPermissions(entity.id, requestUser)) {
      throw new ForbiddenException(
        'You have no permission to access those sources'
      )
    }

    return entity
  }

  /**
   * Method that gets all the addresses of some user
   * @param userId stores the user id
   * @param requestUser stores the logged user data
   * @param crudRequest stores the joins, filters, etc
   * @throws {NotFoundException} if the user was not found
   * @throws {ForbiddenException} if the request user has no
   * permission to execute this action
   * @returns all the found elements
   */
  public async getAddressesByUserId(
    userId: number,
    requestUser: RequestUser,
    crudRequest?: CrudRequest
  ): Promise<GetManyDefaultResponse<AddressEntity> | AddressEntity[]> {
    const entity = await UserEntity.findOne({ id: userId })

    if (!entity || !entity.isActive) {
      throw new NotFoundException(
        `The entity identified by "${userId}" does not exist or is disabled`
      )
    }

    if (!this.hasPermissions(entity.id, requestUser)) {
      throw new ForbiddenException(
        'You have no permission to access those sources'
      )
    }

    crudRequest.parsed.search = {
      $and: [...crudRequest.parsed.search.$and, { userId }]
    }

    return await this.addressService.getMany(crudRequest)
  }

  /**
   * Method that can update some user
   * @param userId stores the target user id
   * @param requestUser stores the logged user data
   * @param updatedUserPayload stores the new user data
   * @throws {NotFoundException} if the user was not found
   * @throws {ForbiddenException} if the request user has no
   * permission to execute this action
   */
  public async update(
    userId: number,
    requestUser: RequestUser,
    updatedUserPayload: UpdateUserPaylaod
  ): Promise<void> {
    const entity = await UserEntity.findOne({ id: userId })

    if (!entity || !entity.isActive) {
      throw new NotFoundException(
        `The entity identified by "${userId}" does not exist or is disabled`
      )
    }

    if (!this.hasPermissions(entity.id, requestUser)) {
      throw new ForbiddenException(
        'You have no permission to access those sources'
      )
    }

    await UserEntity.update({ id: userId }, updatedUserPayload)
  }

  /**
   * Method can delete some user
   * @param userId stores the target user id
   * @param requestUser stores the logged user data
   * @throws {NotFoundException} if the user was not found
   * @throws {ForbiddenException} if the request user has no
   * permission to execute this action
   */
  public async delete(userId: number, requestUser: RequestUser): Promise<void> {
    const entity = await UserEntity.findOne({ id: userId })

    if (!entity || !entity.isActive) {
      throw new NotFoundException(
        `The entity identified by "${userId}" does not exist or is disabled`
      )
    }

    if (!this.hasPermissions(entity.id, requestUser)) {
      throw new ForbiddenException(
        'You have no permission to access those sources'
      )
    }
    await UserEntity.delete({ id: userId })
  }

  /**
   * Method that can disable some user
   * @param userId stores the target user id
   * @param requestUser stores the logged user data
   * @throws {NotFoundException} if the user was not found
   * @throws {ForbiddenException} if the request user has no
   * permission to execute this action
   */
  public async disable(
    userId: number,
    requestUser: RequestUser
  ): Promise<void> {
    const entity = await UserEntity.findOne({ id: userId })

    if (!entity) {
      throw new NotFoundException(
        `The entity identified by "${userId}" does not exist or is disabled`
      )
    }

    if (!entity.isActive) {
      throw new ConflictException(
        `The entity identified by "${userId}" is already disabled`
      )
    }

    if (!this.hasPermissions(entity.id, requestUser)) {
      throw new ForbiddenException(
        'You have no permission to access those sources'
      )
    }

    await UserEntity.update({ id: userId }, { isActive: false })
  }

  /**
   * Method that can enable some user
   * @param userId stores the target user id
   * @param requestUser stores the logged user data
   * @throws {NotFoundException} if the user was not found
   * @throws {ForbiddenException} if the request user has no
   * permission to execute this action
   */
  public async enable(userId: number, requestUser: RequestUser): Promise<void> {
    const entity = await UserEntity.findOne({ id: userId })

    if (!entity) {
      throw new NotFoundException(
        `The entity identified by "${userId}" does not exist or is disabled`
      )
    }

    if (entity.isActive) {
      throw new ConflictException(
        `The entity identified by "${userId}" is already enabled`
      )
    }

    if (!this.hasPermissions(entity.id, requestUser)) {
      throw new ForbiddenException(
        'You have no permission to access those sources'
      )
    }

    await UserEntity.update({ id: userId }, { isActive: true })
  }

  //#region Utils

  /**
   * Method that validates if the user can access some source
   * @param entityId stores the found entity
   * @param requestUser stores the logged user
   * @returns true if the user can access some source, otherwise false
   */
  public hasPermissions(entityId: number, requestUser: RequestUser): boolean {
    return entityId === requestUser.id || isAdminUser(requestUser)
  }

  //#endregion
}
