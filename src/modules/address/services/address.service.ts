import { ForbiddenException, Injectable } from '@nestjs/common'
import { NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { CrudRequest, GetManyDefaultResponse } from '@nestjsx/crud'
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm'
import { Repository } from 'typeorm'

import { AddressEntity } from 'src/modules/address/entities/address.entity'

import { CreateAddressPayload } from 'src/modules/address/models/create-address.payload'

import { UserService } from 'src/modules/user/services/user.service'

import { isGetMany } from 'src/utils/crud'
import { RequestUser } from 'src/utils/type.shared'

/**
 * The app's main address service class
 *
 * Class that deals with the addresses data
 */
@Injectable()
export class AddressService extends TypeOrmCrudService<AddressEntity> {
  public constructor(
    @InjectRepository(AddressEntity)
    private readonly repository: Repository<AddressEntity>,
    private readonly userService: UserService
  ) {
    super(repository)
  }

  /**
   * Method that can save some entity in the database
   * @param requestUser stores the logged user data
   * @param createAddressPayload stores the new address data
   * @returns the created address
   */
  public async create(
    requestUser: RequestUser,
    createAddressPayload: CreateAddressPayload
  ): Promise<AddressEntity> {
    const { userId } = createAddressPayload

    const userEntity = await this.userService.get(userId, requestUser)

    if (!userEntity || !userEntity.isActive) {
      throw new NotFoundException(
        `The entity identified by "${userId}" does not exist or is disabled`
      )
    }

    const entity = new AddressEntity({
      ...createAddressPayload,
      user: userEntity
    })

    return await entity.save()
  }

  /**
   * Method that can get one address entity
   * @param addressId stores the address id
   * @param requestUser stores the logged user data
   * @param crudRequest stores the joins, filters, etc
   * @returns the found address entity
   */
  public async get(
    addressId: number,
    requestUser: RequestUser,
    crudRequest?: CrudRequest
  ): Promise<AddressEntity> {
    const entity: AddressEntity = crudRequest
      ? await super.getOne(crudRequest).catch(() => undefined)
      : await AddressEntity.findOne({ id: addressId })

    if (!entity || !entity.isActive) {
      throw new NotFoundException(
        `The entity identified by "${addressId}" does not exist or is disabled`
      )
    }

    if (!this.userService.hasPermissions(entity.userId, requestUser)) {
      throw new ForbiddenException(
        'You have no permission to access those sources'
      )
    }

    return entity
  }

  /**
   * Method that can get some addresses entities
   * @param requestUser stores the logged user data
   * @param crudRequest stores the joins, filters, etc
   * @returns the found addresses entities
   */
  public async getMore(
    requestUser: RequestUser,
    crudRequest?: CrudRequest
  ): Promise<GetManyDefaultResponse<AddressEntity> | AddressEntity[]> {
    const entities = await super.getMany(crudRequest)

    if (
      (isGetMany(entities) ? entities.data : entities).some(
        entity => !this.userService.hasPermissions(entity.userId, requestUser)
      )
    ) {
      throw new ForbiddenException(
        'You have no permission to access those sources'
      )
    }

    return entities
  }
}
