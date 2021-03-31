import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { RatingEntity } from './entities/rating.entity'

import { RatingService } from './services/rating.service'

@Module({
  imports: [TypeOrmModule.forFeature([RatingEntity])],
  controllers: [],
  providers: [RatingService],
  exports: [RatingEntity]
})
export class RatingModule {}
