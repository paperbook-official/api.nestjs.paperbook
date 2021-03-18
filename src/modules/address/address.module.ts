import { Module } from '@nestjs/common'

import { AddressService } from './services/address.service'

import { AddressController } from './controllers/address.controller'

import { UserModule } from '../user/user.module'

@Module({
  imports: [UserModule],
  controllers: [AddressController],
  providers: [AddressService],
  exports: [AddressService]
})
export class AddressModule {}
