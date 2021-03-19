import { Module } from '@nestjs/common'

import { ProductService } from './services/product.service'

import { ProductController } from './controllers/product.controller'

@Module({
  controllers: [ProductController],
  providers: [ProductService],
  exports: [ProductService]
})
export class ProductModule {}
