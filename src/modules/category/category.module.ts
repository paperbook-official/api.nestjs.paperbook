import { forwardRef, Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { CategoryEntity } from './entities/category.entity'

import { CategoryRelationsService } from './services/category-relations.service'
import { CategoryService } from './services/category.service'

import { CategoryRelationsController } from './controllers/category-relations.controller'
import { CategoryController } from './controllers/category.controller'

import { ProductModule } from '../product/product.module'

@Module({
  imports: [
    forwardRef(() => ProductModule),
    TypeOrmModule.forFeature([CategoryEntity])
  ],
  controllers: [CategoryController, CategoryRelationsController],
  providers: [CategoryService, CategoryRelationsService],
  exports: [CategoryService]
})
export class CategoryModule {}
