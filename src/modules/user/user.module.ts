import { forwardRef, Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { UserEntity } from './entities/user.entity'

import { UserService } from './services/user.service'

import { UserRalationsController } from './controllers/user-relations.controller'
import { UserController } from './controllers/user.controller'

import { AddressModule } from '../address/address.module'
import { OrderModule } from '../order/order.module'
import { ProductModule } from '../product/product.module'

@Module({
  imports: [
    forwardRef(() => ProductModule),
    forwardRef(() => AddressModule),
    forwardRef(() => OrderModule),
    TypeOrmModule.forFeature([UserEntity])
  ],
  controllers: [UserController, UserRalationsController],
  providers: [UserService],
  exports: [UserService]
})
export class UserModule {}
