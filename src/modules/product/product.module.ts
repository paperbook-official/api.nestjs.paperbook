import { forwardRef, Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { ProductEntity } from './entities/product.entity'

import { ProductService } from './services/product.service'

import { ProductController } from './controllers/product.controller'

import { CategoryModule } from '../category/category.module'
import { UserModule } from '../user/user.module'

@Module({
  imports: [
    forwardRef(() => UserModule),
    forwardRef(() => CategoryModule),
    TypeOrmModule.forFeature([ProductEntity])
  ],
  controllers: [ProductController],
  providers: [ProductService],
  exports: [ProductService]
})
export class ProductModule {}
