import { Module } from '@nestjs/common'

import { ProductGroupService } from './services/product-group.service'

import { ProductGroupController } from './controllers/product-group.controller'

@Module({
  controllers: [ProductGroupController],
  providers: [ProductGroupService]
})
export class ProductGroupModule {}
