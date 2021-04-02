import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm'
import { Repository } from 'typeorm'

import { ShoppingCartEntity } from '../entities/shopping-cart.entity'

@Injectable()
export class ShoppingCartService extends TypeOrmCrudService<
  ShoppingCartEntity
> {
  public constructor(
    @InjectRepository(ShoppingCartEntity)
    private readonly repository: Repository<ShoppingCartEntity>
  ) {
    super(repository)
  }
}
