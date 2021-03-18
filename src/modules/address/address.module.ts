import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { AddressEntity } from './entities/address.entity'

import { AddressService } from './services/address.service'

import { AddressController } from './controllers/address.controller'

import { UserModule } from '../user/user.module'

@Module({
  imports: [UserModule, TypeOrmModule.forFeature([AddressEntity])],
  controllers: [AddressController],
  providers: [AddressService],
  exports: [AddressService]
})
export class AddressModule {}
