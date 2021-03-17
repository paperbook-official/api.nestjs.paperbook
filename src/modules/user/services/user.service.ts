import {
  ForbiddenException,
  Injectable,
  NotFoundException
} from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { CrudRequest } from '@nestjsx/crud'
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm'
import { Repository } from 'typeorm'

import { UserEntity } from '../entities/user.entity'

import { CreateUserPayload } from '../models/create-user.payload'
import { UpdateUserPaylaod } from '../models/update-user.payload'

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
    private readonly repository: Repository<UserEntity>
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
   * @returns the found user data
   */
  public async get(
    userId: number,
    requestUser: RequestUser,
    crudRequest?: CrudRequest
  ): Promise<UserEntity> {
    let entity: UserEntity

    if (!crudRequest) {
      entity = await UserEntity.findOne({ id: userId })
    } else {
      crudRequest.parsed.search = {
        $and: [
          {
            isActive: true
          },
          ...crudRequest.parsed.search.$and
        ]
      }

      entity = await super.getOne(crudRequest)
    }

    if (!entity || !entity.isActive) {
      throw new NotFoundException(
        `The entity identified by "${userId}" does not exist or is disabled`
      )
    }

    if (!UserService.hasPermissions(entity, requestUser))
      throw new ForbiddenException(
        'You have no permission to access those sources'
      )

    return entity
  }

  /**
   * Method that can update the user data
   * @param userId stores the target user id
   * @param requestUser stores the logged user data
   * @param updatedUserPayload stores the new user data
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

    if (!UserService.hasPermissions(entity, requestUser))
      throw new ForbiddenException(
        'You have no permission to access those sources'
      )

    await UserEntity.update({ id: userId }, updatedUserPayload)
  }

  //#region Utils

  /**
   * Method that validates if the user can access some source
   * @param entity stores the found entity
   * @param requestUser stores the logged user
   * @returns true if the user can access some source, otherwise false
   */
  private static hasPermissions(
    entity: UserEntity,
    requestUser: RequestUser
  ): boolean {
    return entity.id === requestUser.id || isAdminUser(requestUser)
  }

  //#endregion
}
