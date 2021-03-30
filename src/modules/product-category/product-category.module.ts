import { forwardRef, Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { ProductCategoryEntity } from './entities/product-category.entity'

import { ProductCategoryService } from './services/product-category.service'

import { ProductCategoryController } from './controllers/product-category.controller'

import { CategoryModule } from '../category/category.module'
import { ProductModule } from '../product/product.module'

@Module({
  imports: [
    forwardRef(() => CategoryModule),
    forwardRef(() => ProductModule),
    TypeOrmModule.forFeature([ProductCategoryEntity])
  ],
  controllers: [ProductCategoryController],
  providers: [ProductCategoryService],
  exports: [ProductCategoryService]
})
export class ProductCategoryModule {}
