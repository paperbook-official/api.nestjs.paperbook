import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm'
import { Repository } from 'typeorm'

import { RatingEntity } from '../entities/rating.entity'

/**
 * The app's main rating service class
 *
 * Class that deals with the ratings data
 */
@Injectable()
export class RatingService extends TypeOrmCrudService<RatingEntity> {
  public constructor(
    @InjectRepository(RatingEntity)
    private readonly repository: Repository<RatingEntity>
  ) {
    super(repository)
  }
}
