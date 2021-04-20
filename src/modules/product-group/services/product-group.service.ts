import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm'
import { Repository } from 'typeorm'

import { ProductGroupEntity } from '../entities/product-group.entity'

/**
 * The app's main product group service clas
 *
 * Class that deals with the product groupo data
 */
@Injectable()
export class ProductGroupService extends TypeOrmCrudService<
  ProductGroupEntity
> {
  public constructor(
    @InjectRepository(ProductGroupEntity)
    repository: Repository<ProductGroupEntity>
  ) {
    super(repository)
  }
}
