import { forwardRef, Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { UserEntity } from './entities/user.entity'

import { UserService } from './services/user.service'

import { UserController } from './controllers/user.controller'

import { AddressModule } from '../address/address.module'
import { ProductModule } from '../product/product.module'

@Module({
  imports: [
    forwardRef(() => ProductModule),
    forwardRef(() => AddressModule),
    TypeOrmModule.forFeature([UserEntity])
  ],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService]
})
export class UserModule {}
