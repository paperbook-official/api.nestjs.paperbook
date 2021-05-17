import {
  BadRequestException,
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
import { EntityAlreadyDisabledException } from 'src/exceptions/conflict/entity-already-disabled.exception'
import { EntityAlreadyEnabledException } from 'src/exceptions/conflict/entity-already-enabled.exception'
import { EntityNotFoundException } from 'src/exceptions/not-found/entity-not-found.exception'
import { AddressEntity } from 'src/modules/address/entities/address.entity'
import { OrderEntity } from 'src/modules/order/entities/order.entity'
import { ProductGroupEntity } from 'src/modules/product-group/entities/product-group.entity'
import { ProductEntity } from 'src/modules/product/entities/product.entity'
import { ShoppingCartEntity } from 'src/modules/shopping-cart/entities/shopping-cart.entity'

import { RemoveProductGroupDto } from '../../shopping-cart/models/remove-product-group.dto'
import { CreateUserDto } from '../models/create-user.dto'
import { UpdateUserDto } from '../models/update-user.dto'
import { AddProductGroupDto } from 'src/modules/shopping-cart/models/add-product-group.dto'
import { FinishShoppingCartDto } from 'src/modules/shopping-cart/models/finish-shopping-cart.dto'

import { ProductGroupService } from '../../product-group/services/product-group.service'
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
    private readonly shoppingCartService: ShoppingCartService,
    private readonly productGroupService: ProductGroupService
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
   *
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
   *
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
   *
   * @param userId stores the user id
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
   *
   * @param userId stores the user id
   * @param requestUser stores the logged user data
   * @param crudRequest stores the joins, filters, etc
   * @throws {EntityNotFoundException} if the user was not found
   * @throws {ForbiddenException} if the request user has no
   * permission to execute this action
   * @returns all the found shopping cart entities
   */
  public async getShoppingCartByUserId(
    userId: number,
    requestUser: UserEntity,
    crudRequest?: CrudRequest
  ): Promise<ShoppingCartEntity> {
    const entity = await UserEntity.findOne({ id: userId })

    if (!entity || !entity.isActive) {
      throw new EntityNotFoundException(userId, UserEntity)
    }

    if (!this.hasPermissions(entity.id, requestUser)) {
      throw new ForbiddenException()
    }

    let shoppingCart: ShoppingCartEntity

    if (crudRequest) {
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
      shoppingCart = await this.shoppingCartService.getOne(crudRequest)
    } else {
      shoppingCart = await ShoppingCartEntity.findOne({ userId })
    }

    if (!shoppingCart || !shoppingCart.isActive) {
      throw new NotFoundException('This user has no shopping cart')
    }

    return shoppingCart
  }

  /**
   * Method that gets all the orders of some user
   *
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
   *
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
   *
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
   *
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
   *
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

  /**
   * Method that can add some product in the user shopping cart
   *
   * @param userId stores the user id
   * @param requestUser store the logged user data
   * @param addProductGroupDtos stores the product group entity data
   */
  public async addProductInShoppingCartByUserId(
    userId: number,
    requestUser: UserEntity,
    addProductGroupDtos: AddProductGroupDto[],
    clean: boolean
  ): Promise<ProductGroupEntity[]> {
    const user = await this.get(userId, requestUser)

    let shoppingCart: ShoppingCartEntity
    if (clean) {
      if (user.shoppingCartId) {
        await ShoppingCartEntity.delete(user.shoppingCartId)
      }

      shoppingCart = await new ShoppingCartEntity({ userId, user }).save()
      await UserEntity.update(
        { id: userId },
        { shoppingCartId: shoppingCart.id }
      )
      await user.reload()
    } else {
      if (user.shoppingCartId) {
        shoppingCart = await ShoppingCartEntity.findOne({
          id: user.shoppingCartId
        })
      } else {
        shoppingCart = await new ShoppingCartEntity({ userId, user }).save()
        await UserEntity.update(
          { id: userId },
          { shoppingCartId: shoppingCart.id }
        )
        await user.reload()
      }
    }

    const productGroups: ProductGroupEntity[] = []

    for (const addProductGroupDto of addProductGroupDtos) {
      const { productId, amount } = addProductGroupDto

      let productGroup = await ProductGroupEntity.findOne({
        productId,
        shoppingCartId: user.shoppingCartId
      })

      if (!productGroup) {
        productGroup = await this.productGroupService.create({
          shoppingCartId: shoppingCart.id,
          amount,
          productId
        })
      } else {
        await this.productGroupService.update(productGroup.id, {
          amount: productGroup.amount + amount
        })
        await productGroup.reload()
      }

      productGroups.push(productGroup)
    }

    return productGroups
  }

  /**
   * Method that can remove some product from the user shopping cart
   *
   * @param userId stores the user id
   * @param requestUser stores the logged user data
   * @param removeProductGroupDto stores an object that informs how many product will be remove
   * and which product is
   */
  public async removeProductFromShoppingCartByUserId(
    userId: number,
    requestUser: UserEntity,
    removeProductGroupDto: RemoveProductGroupDto
  ): Promise<void> {
    const { shoppingCartId } = await this.get(userId, requestUser)

    if (shoppingCartId === undefined || shoppingCartId === null) {
      throw new NotFoundException('User has no created shopping cart')
    }

    let { amount } = removeProductGroupDto
    const { productId } = removeProductGroupDto

    const productGroup = await ProductGroupEntity.findOne({
      productId,
      shoppingCartId
    })

    if (!productGroup || !productGroup.isActive) {
      throw new NotFoundException('User has no any product of this type')
    }

    if (productGroup.amount - amount < 0) {
      amount = 0
      await this.productGroupService.delete(productGroup.id)
    } else {
      amount = productGroup.amount - amount
      await this.productGroupService.update(productGroup.id, {
        amount
      })
    }
  }

  /**
   * Method that creates a new order based on the shopping cart and
   * deletes the shopping cart
   *
   * @param userId stores the user id
   * @param requestUser stores the logged user data
   * @returns the created order entity
   */
  public async finishShoppingCartByUserId(
    userId: number,
    requestUser: UserEntity,
    finishShoppingCartDto: FinishShoppingCartDto
  ): Promise<OrderEntity> {
    if (!this.hasPermissions(userId, requestUser)) {
      throw new ForbiddenException()
    }

    // validate if the shopping cart exists
    const shoppingCart = await ShoppingCartEntity.findOne({ userId })
    if (!shoppingCart || !shoppingCart.isActive) {
      throw new NotFoundException(
        `The user with identifier ${userId} has no shopping cart`
      )
    }

    const { addressId, shippingPrice } = finishShoppingCartDto

    // validate if the address exists
    const address = await AddressEntity.findOne({ id: addressId })
    if (!address || !address.isActive) {
      throw new EntityNotFoundException(addressId, AddressEntity)
    }

    const productGroups = await ProductGroupEntity.find({
      shoppingCartId: shoppingCart.id
    })

    const products = await ProductEntity.findByIds(
      productGroups.map(productGroup => productGroup.productId)
    )

    if (
      products.some(
        (product, index) =>
          product.stockAmount - productGroups[index].amount < 0
      )
    ) {
      throw new BadRequestException('The amount required is out of bounds')
    }

    const installmentAmount = products.reduce(
      (previous, current) =>
        (current.installmentAmount ?? 1) < (previous.installmentAmount ?? 1)
          ? current
          : previous,
      products[0]
    ).installmentAmount

    // create a new order
    const order = await new OrderEntity({
      cep: address.cep,
      houseNumber: address.houseNumber,
      shippingPrice,
      userId,
      installmentAmount,
      trackingCode: this.orderService.generateTrackingCode()
    }).save()

    // duplicate all the product group entities and relate them with the order entity
    productGroups.forEach(async productGroup => {
      const { amount, productId } = productGroup

      await new ProductGroupEntity({
        amount,
        productId,
        orderId: order.id
      }).save()
    })

    // removes from the stock the built products
    products.forEach(async (product, index) => {
      product.stockAmount -= productGroups[index].amount
      await product.save()
    })

    await UserEntity.update({ id: userId }, { shoppingCartId: undefined })
    await ShoppingCartEntity.delete({ id: shoppingCart.id })

    return order
  }

  //#region Utils

  /**
   * Method that validates if the user can access some source
   *
   * @param userId stores the found entity
   * @param requestUser stores the logged user
   * @returns true if the user can access some source, otherwise false
   */
  public hasPermissions(userId: number, requestUser: UserEntity): boolean {
    return userId === requestUser.id || this.isAdminUser(requestUser)
  }

  /**
   * Method that can test if the request user has the type "ADMIM"
   *
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
   *
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
