import { forwardRef, Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { ProductEntity } from './entities/product.entity'

import { ProductRelationsService } from './services/product-relations.service'
import { ProductService } from './services/product.service'

import { ProductRelationsController } from './controllers/product-relations.controller'
import { ProductController } from './controllers/product.controller'

import { CategoryModule } from '../category/category.module'
import { RatingModule } from '../rating/rating.module'
import { UserModule } from '../user/user.module'

@Module({
  imports: [
    forwardRef(() => UserModule),
    forwardRef(() => CategoryModule),
    forwardRef(() => RatingModule),
    TypeOrmModule.forFeature([ProductEntity]),
  ],
  controllers: [ProductController, ProductRelationsController],
  providers: [ProductService, ProductRelationsService],
  exports: [ProductService],
})
export class ProductModule {}
