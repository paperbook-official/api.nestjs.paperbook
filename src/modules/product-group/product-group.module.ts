import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { ProductGroupEntity } from './entities/product-group.entity'

import { ProductGroupService } from './services/product-group.service'

import { ProductGroupController } from './controllers/product-group.controller'

import { ProductModule } from '../product/product.module'
import { ShoppingCartModule } from '../shopping-cart/shopping-cart.module'

@Module({
  imports: [
    ProductModule,
    ShoppingCartModule,
    TypeOrmModule.forFeature([ProductGroupEntity])
  ],
  controllers: [ProductGroupController],
  providers: [ProductGroupService],
  exports: [ProductGroupService]
})
export class ProductGroupModule {}
