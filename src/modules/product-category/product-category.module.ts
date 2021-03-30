import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { ProductCategoryEntity } from './entities/product-category.entity'

import { ProductCategoryService } from './services/product-category.service'

import { ProductCategoryController } from './controllers/product-category.controller'

import { CategoryModule } from '../category/category.module'
import { ProductModule } from '../product/product.module'

@Module({
  imports: [
    ProductModule,
    CategoryModule,
    TypeOrmModule.forFeature([ProductCategoryEntity])
  ],
  controllers: [ProductCategoryController],
  providers: [ProductCategoryService]
})
export class ProductCategoryModule {}
