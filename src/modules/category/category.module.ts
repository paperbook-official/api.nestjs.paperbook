import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { CategoryEntity } from './entities/category.entity'

import { CategoryService } from './services/category.service'

import { CategoryController } from './controllers/category.controller'

import { UserModule } from '../user/user.module'

@Module({
  imports: [UserModule, TypeOrmModule.forFeature([CategoryEntity])],
  controllers: [CategoryController],
  providers: [CategoryService],
  exports: [CategoryService]
})
export class CategoryModule {}
