import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm'
import { Repository } from 'typeorm'

import { ProductEntity } from '../entities/product.entity'

import { CreateProductPaylaod } from '../models/create-product.payload'

import { UserService } from 'src/modules/user/services/user.service'

import { RequestUser } from 'src/utils/type.shared'

/**
 * The app's main product service class
 *
 * Class that deals with the products data
 */
@Injectable()
export class ProductService extends TypeOrmCrudService<ProductEntity> {
  public constructor(
    @InjectRepository(ProductEntity)
    private readonly repository: Repository<ProductEntity>,
    private readonly userService: UserService
  ) {
    super(repository)
  }

  /**
   * Method that can save some entity in the database
   * @param requestUser stores the logged user data
   * @param createProductPayload stores the new product data
   * @throws {NotFoundException} if the user was not found
   * @throws {ForbiddenException} if the request user has no permissions
   * to execute this action
   * @returns the created product
   */
  public async create(
    requestUser: RequestUser,
    createProductPayload: CreateProductPaylaod
  ): Promise<ProductEntity> {
    const user = await this.userService.get(
      createProductPayload.userId,
      requestUser
    )
    return await new ProductEntity({
      ...createProductPayload,
      user
    }).save()
  }
}
