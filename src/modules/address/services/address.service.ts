import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { CrudRequest, GetManyDefaultResponse } from '@nestjsx/crud'
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm'
import { Repository } from 'typeorm'

import { EntityAlreadyDisabledException } from 'src/exceptions/conflict/entity-already-disabled.exception'
import { EntityAlreadyEnabledException } from 'src/exceptions/conflict/entity-already-enabled.exception'
import { ForbiddenException } from 'src/exceptions/forbidden/forbidden.exception'
import { EntityNotFoundException } from 'src/exceptions/not-found/entity-not-found.exception'

import { AddressEntity } from 'src/modules/address/entities/address.entity'
import { UserEntity } from 'src/modules/user/entities/user.entity'

import { CreateAddressDto } from '../models/create-address.dto'
import { UpdatedAddressDto } from '../models/update-address.dto'

import { UserService } from 'src/modules/user/services/user.service'

import { isGetMany } from 'src/utils/crud'

/**
 * The app's main address service class
 *
 * Class that deals with the addresses data
 */
@Injectable()
export class AddressService extends TypeOrmCrudService<AddressEntity> {
  public constructor(
    @InjectRepository(AddressEntity)
    repository: Repository<AddressEntity>,
  ) {
    super(repository)
  }

  /**
   * Method that can save some entity in the database
   *
   * @param requestUser stores the logged user data
   * @param createAddressDto stores the new address data
   * @throws {EntityNotFoundException} if the user was not found
   * @throws {ForbiddenException} if the request user has no permission
   * to access those sources
   * @returns the created address entity
   */
  public async create(
    requestUser: UserEntity,
    createAddressDto: CreateAddressDto,
  ): Promise<AddressEntity> {
    const { userId } = createAddressDto

    const user = await UserEntity.findOne({ id: userId })

    if (!user) {
      throw new EntityNotFoundException(userId, UserEntity)
    }

    if (!UserService.hasPermissions(userId, requestUser)) {
      throw new ForbiddenException()
    }

    const entity = new AddressEntity({
      ...createAddressDto,
      user,
    })

    return await entity.save()
  }

  /**
   * Method that can get some addresses entities
   *
   * @param requestUser stores the logged user data
   * @param crudRequest stores the joins, filters, etc
   * @throws {ForbiddenException} if the request user has no permission
   * to access those sources
   * @returns the found address entities
   */
  public async listMany(
    requestUser: UserEntity,
    crudRequest?: CrudRequest,
  ): Promise<GetManyDefaultResponse<AddressEntity> | AddressEntity[]> {
    const entities = await super.getMany(crudRequest)

    if (
      (isGetMany(entities) ? entities.data : entities).some(
        entity => !UserService.hasPermissions(entity.userId, requestUser),
      )
    ) {
      throw new ForbiddenException()
    }

    return entities
  }

  /**
   * Method that can get one address entity
   *
   * @param addressId stores the address id
   * @param requestUser stores the logged user data
   * @param crudRequest stores the joins, filters, etc
   * @throws {EntityNotFoundException} if the address was not found
   * @throws {ForbiddenException} if the request user has no permission
   * to access those sources
   * @returns the found address entity
   */
  public async listOne(
    addressId: number,
    requestUser: UserEntity,
    crudRequest?: CrudRequest,
  ): Promise<AddressEntity> {
    const entity: AddressEntity = crudRequest
      ? await super.getOne(crudRequest).catch(() => undefined)
      : await AddressEntity.findOne({ id: addressId })

    if (!entity || !entity.isActive) {
      throw new EntityNotFoundException(addressId, AddressEntity)
    }

    if (!UserService.hasPermissions(entity.userId, requestUser)) {
      throw new ForbiddenException()
    }

    return entity
  }

  /**
   * Method that can update some address
   *
   * @param addressId stores the address id
   * @param requestUser stores the logged user data
   * @param updatedAddressDto stores the new address data
   * @throws {EntityNotFoundException} if the address was not found
   * @throws {ForbiddenException} if the request user has no permission
   * to access those sources
   */
  public async update(
    addressId: number,
    requestUser: UserEntity,
    updatedAddressDto: UpdatedAddressDto,
  ): Promise<void> {
    const entity = await AddressEntity.findOne({ id: addressId })

    if (!entity || !entity.isActive) {
      throw new EntityNotFoundException(addressId, AddressEntity)
    }

    if (!UserService.hasPermissions(entity.userId, requestUser)) {
      throw new ForbiddenException()
    }

    await AddressEntity.update({ id: addressId }, updatedAddressDto)
  }

  /**
   * Method that can delete some address
   *
   * @param addressId stores the address id
   * @param requestUser stores the logged user data
   * @throws {EntityNotFoundException} if the address was not found
   * @throws {ForbiddenException} if the request user has no permission
   * to access those sources
   */
  public async delete(
    addressId: number,
    requestUser: UserEntity,
  ): Promise<void> {
    const entity = await AddressEntity.findOne({ id: addressId })

    if (!entity || !entity.isActive) {
      throw new EntityNotFoundException(addressId, AddressEntity)
    }

    if (!UserService.hasPermissions(entity.userId, requestUser)) {
      throw new ForbiddenException()
    }

    await AddressEntity.delete({ id: addressId })
  }

  /**
   * Method that can disable some address
   *
   * @param addressId stores the address id
   * @param requestUser stores the logged user data
   * @throws {EntityNotFoundException} if the address was not found
   * @throws {ForbiddenException} if the request user has no permission
   * to access those sources
   * @throws {EntityAlreadyDisabledException} if the address is already disabled
   */
  public async disable(
    addressId: number,
    requestUser: UserEntity,
  ): Promise<void> {
    const entity = await AddressEntity.findOne({ id: addressId })

    if (!entity) {
      throw new EntityNotFoundException(addressId, AddressEntity)
    }

    if (!entity.isActive) {
      throw new EntityAlreadyDisabledException(addressId, AddressEntity)
    }

    if (!UserService.hasPermissions(entity.userId, requestUser)) {
      throw new ForbiddenException()
    }

    await AddressEntity.update({ id: addressId }, { isActive: false })
  }

  /**
   * Method that can enable some address
   *
   * @param addressId stores the address id
   * @param requestUser stores the logged user data
   * @throws {EntityNotFoundException} if the address was not found
   * @throws {ForbiddenException} if the request user has no permission
   * to access those sources
   * @throws {EntityAlreadyEnabledException} if the address is already enabled
   */
  public async enable(
    addressId: number,
    requestUser: UserEntity,
  ): Promise<void> {
    const entity = await AddressEntity.findOne({ id: addressId })

    if (!entity) {
      throw new EntityNotFoundException(addressId, AddressEntity)
    }

    if (entity.isActive) {
      throw new EntityAlreadyEnabledException(addressId, AddressEntity)
    }

    if (!UserService.hasPermissions(entity.userId, requestUser)) {
      throw new ForbiddenException()
    }

    await AddressEntity.update({ id: addressId }, { isActive: true })
  }
}
