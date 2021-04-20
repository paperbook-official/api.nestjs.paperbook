import { forwardRef, Inject, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { CrudRequest, GetManyDefaultResponse } from '@nestjsx/crud'
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm'
import { Repository } from 'typeorm'

import { UserEntity } from '../entities/user.entity'
import { EntityAlreadyDisabledException } from 'src/exceptions/conflict/entity-already-disabled.exception'
import { EntityAlreadyEnabledException } from 'src/exceptions/conflict/entity-already-enabled.exception'
import { EntityNotFoundException } from 'src/exceptions/not-found/entity-not-found.exception'
import { AddressEntity } from 'src/modules/address/entities/address.entity'
import { OrderEntity } from 'src/modules/order/entities/order.entity'
import { ProductEntity } from 'src/modules/product/entities/product.entity'
import { ShoppingCartEntity } from 'src/modules/shopping-cart/entities/shopping-cart.entity'

import { CreateUserDto } from '../models/create-user.dto'
import { UpdateUserDto } from '../models/update-user.dto'

import { AddressService } from 'src/modules/address/services/address.service'
import { OrderService } from 'src/modules/order/services/order.service'
import { PasswordService } from 'src/modules/password/services/password.service'
import { ProductService } from 'src/modules/product/services/product.service'
import { ShoppingCartService } from 'src/modules/shopping-cart/services/shopping-cart.service'

import { ForbiddenException } from 'src/exceptions/forbidden/forbidden.exception'
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
    repository: Repository<UserEntity>,
    private readonly passwordService: PasswordService,
    @Inject(forwardRef(() => AddressService))
    private readonly addressService: AddressService,
    @Inject(forwardRef(() => ProductService))
    private readonly productService: ProductService,
    @Inject(forwardRef(() => OrderService))
    private readonly orderService: OrderService,
    @Inject(forwardRef(() => ShoppingCartService))
    private readonly shoppingCartService: ShoppingCartService
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
      entity.password
    )
    entity.roles = entity.roles ?? RolesEnum.User

    return await entity.save()
  }

  /**
   * Method that can get one user entity
   * @param userId stores the target user id
   * @param requestUser stores the logged user data
   * @param crudRequest stores the joins, filters, etc
   * @throws {EntityNotFoundException} if the user was not found
   * @throws {ForbiddenException} if the request user has no
   * permission to execute this action
   * @returns the found user entity
   */
  public async get(
    userId: number,
    requestUser: UserEntity,
    crudRequest?: CrudRequest
  ): Promise<UserEntity> {
    let entity: UserEntity

    if (crudRequest) {
      crudRequest.parsed.search = {
        $and: [
          ...crudRequest.parsed.search.$and,
          {
            id: {
              $eq: userId
            }
          }
        ]
      }
      entity = await super.getOne(crudRequest).catch(() => undefined)
    } else {
      entity = await UserEntity.findOne({ id: userId })
    }

    if (!entity || !entity.isActive) {
      throw new EntityNotFoundException(userId)
    }

    if (!this.hasPermissions(entity.id, requestUser)) {
      throw new ForbiddenException()
    }

    return entity
  }

  /**
   * Method that gets all the addresses of some user
   * @param userId stores the user id
   * @param requestUser stores the logged user data
   * @param crudRequest stores the joins, filters, etc
   * @throws {EntityNotFoundException} if the user was not found
   * @throws {ForbiddenException} if the request user has no
   * permission to execute this action
   * @returns all the found elements
   */
  public async getAddressesByUserId(
    userId: number,
    requestUser: UserEntity,
    crudRequest?: CrudRequest
  ): Promise<GetManyDefaultResponse<AddressEntity> | AddressEntity[]> {
    const entity = await UserEntity.findOne({ id: userId })

    if (!entity || !entity.isActive) {
      throw new EntityNotFoundException(userId, UserEntity)
    }

    if (!this.hasPermissions(entity.id, requestUser)) {
      throw new ForbiddenException()
    }

    crudRequest.parsed.search = {
      $and: [
        ...crudRequest.parsed.search.$and,
        {
          userId: {
            $eq: userId
          }
        }
      ]
    }

    return await this.addressService.getMany(crudRequest)
  }

  /**
   * Method that gets all the products of some user
   * @param userId stores the user id
   * @param requestUser stores the logged user data
   * @param crudRequest stores the joins, filters, etc
   * @throws {EntityNotFoundException} if the user was not found
   * @throws {ForbiddenException} if the request user has no
   * permission to execute this action
   * @returns all the product entities
   */
  public async getProductsByUserId(
    userId: number,
    crudRequest?: CrudRequest
  ): Promise<GetManyDefaultResponse<ProductEntity> | ProductEntity[]> {
    const entity = await UserEntity.findOne({ id: userId })

    if (!entity || !entity.isActive) {
      throw new EntityNotFoundException(userId, UserEntity)
    }

    crudRequest.parsed.search = {
      $and: [
        ...crudRequest.parsed.search.$and,
        {
          userId: {
            $eq: userId
          }
        }
      ]
    }

    return await this.productService.getMany(crudRequest)
  }

  /**
   * Method that gets all the shopping carts related with some user
   * @param userId stores the user id
   * @param requestUser stores the logged user data
   * @param crudRequest stores the joins, filters, etc
   * @throws {EntityNotFoundException} if the user was not found
   * @throws {ForbiddenException} if the request user has no
   * permission to execute this action
   * @returns all the found shopping cart entities
   */
  public async getShoppingCartsByUserId(
    userId: number,
    requestUser: UserEntity,
    crudRequest?: CrudRequest
  ): Promise<
    GetManyDefaultResponse<ShoppingCartEntity> | ShoppingCartEntity[]
  > {
    const entity = await UserEntity.findOne({ id: userId })

    if (!entity || !entity.isActive) {
      throw new EntityNotFoundException(userId, UserEntity)
    }

    if (!this.hasPermissions(entity.id, requestUser)) {
      throw new ForbiddenException()
    }

    crudRequest.parsed.search = {
      $and: [
        ...crudRequest.parsed.search.$and,
        {
          userId: {
            $eq: userId
          }
        }
      ]
    }

    return await this.shoppingCartService.getMany(crudRequest)
  }

  /**
   * Method that gets all the orders of some user
   * @param userId stores the user id
   * @param requestUser stores the logged user data
   * @param crudRequest stores the joins, filters, etc
   * @throws {EntityNotFoundException} if the user was not found
   * @throws {ForbiddenException} if the request user has no
   * permission to execute this action
   * @returns all the found elements
   */
  public async getOrdersByUserId(
    userId: number,
    requestUser: UserEntity,
    crudRequest?: CrudRequest
  ): Promise<GetManyDefaultResponse<OrderEntity> | OrderEntity[]> {
    const entity = await UserEntity.findOne({ id: userId })

    if (!entity || !entity.isActive) {
      throw new EntityNotFoundException(userId, UserEntity)
    }

    if (!this.hasPermissions(entity.id, requestUser)) {
      throw new ForbiddenException()
    }

    crudRequest.parsed.search = {
      $and: [
        ...crudRequest.parsed.search.$and,
        {
          userId: {
            $eq: userId
          }
        }
      ]
    }

    return await this.orderService.getMany(crudRequest)
  }

  /**
   * Method that can update some user
   * @param userId stores the target user id
   * @param requestUser stores the logged user data
   * @param updatedUserPayload stores the new user data
   * @throws {EntityNotFoundException} if the user was not found
   * @throws {ForbiddenException} if the request user has no
   * permission to execute this action
   */
  public async update(
    userId: number,
    requestUser: UserEntity,
    updatedUserPayload: UpdateUserDto
  ): Promise<void> {
    const entity = await UserEntity.findOne({ id: userId })

    if (!entity || !entity.isActive) {
      throw new EntityNotFoundException(userId)
    }

    if (!this.hasPermissions(entity.id, requestUser)) {
      throw new ForbiddenException()
    }

    await UserEntity.update({ id: userId }, updatedUserPayload)
  }

  /**
   * Method can delete some user
   * @param userId stores the target user id
   * @param requestUser stores the logged user data
   * @throws {EntityNotFoundException} if the user was not found
   * @throws {ForbiddenException} if the request user has no
   * permission to execute this action
   */
  public async delete(userId: number, requestUser: UserEntity): Promise<void> {
    const entity = await UserEntity.findOne({ id: userId })

    if (!entity || !entity.isActive) {
      throw new EntityNotFoundException(userId)
    }

    if (!this.hasPermissions(entity.id, requestUser)) {
      throw new ForbiddenException()
    }
    await UserEntity.delete({ id: userId })
  }

  /**
   * Method that can disable some user
   * @param userId stores the target user id
   * @param requestUser stores the logged user data
   * @throws {EntityNotFoundException} if the user was not found
   * @throws {ForbiddenException} if the request user has no
   * permission to execute this action
   */
  public async disable(userId: number, requestUser: UserEntity): Promise<void> {
    const entity = await UserEntity.findOne({ id: userId })

    if (!entity) {
      throw new EntityNotFoundException(userId)
    }

    if (!entity.isActive) {
      throw new EntityAlreadyDisabledException(userId, UserEntity)
    }

    if (!this.hasPermissions(entity.id, requestUser)) {
      throw new ForbiddenException()
    }

    await UserEntity.update({ id: userId }, { isActive: false })
  }

  /**
   * Method that can enable some user
   * @param userId stores the target user id
   * @param requestUser stores the logged user data
   * @throws {EntityNotFoundException} if the user was not found
   * @throws {ForbiddenException} if the request user has no
   * permission to execute this action
   */
  public async enable(userId: number, requestUser: UserEntity): Promise<void> {
    const entity = await UserEntity.findOne({ id: userId })

    if (!entity) {
      throw new EntityNotFoundException(userId)
    }

    if (entity.isActive) {
      throw new EntityAlreadyEnabledException(userId, UserEntity)
    }

    if (!this.hasPermissions(entity.id, requestUser)) {
      throw new ForbiddenException()
    }

    await UserEntity.update({ id: userId }, { isActive: true })
  }

  //#region Utils

  /**
   * Method that validates if the user can access some source
   * @param userId stores the found entity
   * @param requestUser stores the logged user
   * @returns true if the user can access some source, otherwise false
   */
  public hasPermissions(userId: number, requestUser: UserEntity): boolean {
    return userId === requestUser.id || this.isAdminUser(requestUser)
  }

  /**
   * Method that can test if the request user has the type "ADMIM"
   * @param requestUser stores the user basic data
   */
  public isAdminUser(requestUser: UserEntity): boolean {
    return (
      requestUser &&
      requestUser.roles &&
      this.hasRole(requestUser.roles, RolesEnum.Admin)
    )
  }

  /**
   * Method that can compare roles
   * @param roles stores the roles that will be compared
   * @param targetRoles stores one or more roles that will be compared as well
   */
  public hasRole(roles: string, targetRoles: string): boolean {
    return (
      roles &&
      roles.length !== 0 &&
      roles.split('|').some(role => targetRoles.includes(role))
    )
  }

  //#endregion
}
