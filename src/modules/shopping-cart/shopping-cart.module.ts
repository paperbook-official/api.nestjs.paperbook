import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { ShoppingCartEntity } from './entities/shopping-cart.entity'

import { ShoppingCartService } from './services/shopping-cart.service'

import { ShoppingCartController } from './controllers/shopping-cart.controller'

import { ProductModule } from '../product/product.module'
import { UserModule } from '../user/user.module'

@Module({
  imports: [
    UserModule,
    ProductModule,
    TypeOrmModule.forFeature([ShoppingCartEntity])
  ],
  controllers: [ShoppingCartController],
  providers: [ShoppingCartService],
  exports: [ShoppingCartService]
})
export class ShoppingCartModule {}
