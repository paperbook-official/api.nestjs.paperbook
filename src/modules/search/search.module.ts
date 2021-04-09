import { Module } from '@nestjs/common'

import { SearchController } from './controllers/search.controller'

import { ProductModule } from '../product/product.module'

@Module({
  imports: [ProductModule],
  controllers: [SearchController]
})
export class SearchModule {}
