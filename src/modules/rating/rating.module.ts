import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { RatingEntity } from './entities/rating.entity'

import { RatingService } from './services/rating.service'

import { RatingController } from './controllers/rating.controller'

@Module({
  imports: [TypeOrmModule.forFeature([RatingEntity])],
  controllers: [RatingController],
  providers: [RatingService],
  exports: [RatingService]
})
export class RatingModule {}
