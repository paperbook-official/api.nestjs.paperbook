import { Module } from '@nestjs/common'

import { ProductCategoryService } from './services/product-category.service'

import { ProductCategoryController } from './controllers/product-category.controller'

@Module({
  controllers: [ProductCategoryController],
  providers: [ProductCategoryService]
})
export class ProductCategoryModule {}
