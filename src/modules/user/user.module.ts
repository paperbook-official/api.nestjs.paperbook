import { forwardRef, Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { UserEntity } from './entities/user.entity'

import { UserRelationsService } from './services/user-relations.service'
import { UserService } from './services/user.service'

import { UserRelationsController } from './controllers/user-relations.controller'
import { UserController } from './controllers/user.controller'

import { AddressModule } from '../address/address.module'
import { OrderModule } from '../order/order.module'
import { PasswordModule } from '../password/password.module'
import { ProductGroupModule } from '../product-group/product-group.module'
import { ProductModule } from '../product/product.module'
import { ShoppingCartModule } from '../shopping-cart/shopping-cart.module'

@Module({
  imports: [
    PasswordModule,
    ProductGroupModule,
    forwardRef(() => ProductModule),
    forwardRef(() => AddressModule),
    forwardRef(() => OrderModule),
    forwardRef(() => ShoppingCartModule),
    TypeOrmModule.forFeature([UserEntity])
  ],
  controllers: [UserController, UserRelationsController],
  providers: [UserService, UserRelationsService],
  exports: [UserService]
})
export class UserModule {}
