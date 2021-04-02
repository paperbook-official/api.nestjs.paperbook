import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { ShoppingCartEntity } from './entities/shopping-cart.entity'

import { ShoppingCartService } from './services/shopping-cart.service'

import { ShoppingCartController } from './controllers/shopping-cart.controller'

@Module({
  imports: [TypeOrmModule.forFeature([ShoppingCartEntity])],
  controllers: [ShoppingCartController],
  providers: [ShoppingCartService],
  exports: [ShoppingCartService]
})
export class ShoppingCartModule {}
