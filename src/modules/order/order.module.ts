import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { OrderEntity } from './entities/order.entity'

import { OrderService } from './services/order.service'

import { OrderController } from './controllers/order.controller'

import { ProductModule } from '../product/product.module'
import { UserModule } from '../user/user.module'

@Module({
  imports: [UserModule, ProductModule, TypeOrmModule.forFeature([OrderEntity])],
  controllers: [OrderController],
  providers: [OrderService],
  exports: [OrderService]
})
export class OrderModule {}
