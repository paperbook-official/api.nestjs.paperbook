import { forwardRef, Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { RatingEntity } from './entities/rating.entity'

import { RatingService } from './services/rating.service'

import { RatingController } from './controllers/rating.controller'

import { ProductModule } from '../product/product.module'
import { UserModule } from '../user/user.module'

@Module({
  imports: [
    forwardRef(() => UserModule),
    forwardRef(() => ProductModule),
    TypeOrmModule.forFeature([RatingEntity])
  ],
  controllers: [RatingController],
  providers: [RatingService],
  exports: [RatingService]
})
export class RatingModule {}
