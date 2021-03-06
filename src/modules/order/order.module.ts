import { forwardRef, Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { OrderEntity } from './entities/order.entity'

import { OrderService } from './services/order.service'

import { OrderController } from './controllers/order.controller'

import { UserModule } from '../user/user.module'

@Module({
  imports: [
    forwardRef(() => UserModule),
    TypeOrmModule.forFeature([OrderEntity])
  ],
  controllers: [OrderController],
  providers: [OrderService],
  exports: [OrderService]
})
export class OrderModule {}
