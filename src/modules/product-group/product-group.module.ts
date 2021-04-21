import { Module } from '@nestjs/common'

import { ProductGroupService } from './services/product-group.service'

import { ProductGroupController } from './controllers/product-group.controller'

import { ProductModule } from '../product/product.module'
import { ShoppingCartModule } from '../shopping-cart/shopping-cart.module'

@Module({
  imports: [ProductModule, ShoppingCartModule],
  controllers: [ProductGroupController],
  providers: [ProductGroupService]
})
export class ProductGroupModule {}
