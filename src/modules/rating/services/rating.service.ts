import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm'
import { Repository } from 'typeorm'

import { RatingEntity } from '../entities/rating.entity'

import { CreateRatingPayload } from '../models/create-rating.payload'

import { ProductService } from 'src/modules/product/services/product.service'

/**
 * The app's main rating service class
 *
 * Class that deals with the ratings data
 */
@Injectable()
export class RatingService extends TypeOrmCrudService<RatingEntity> {
  public constructor(
    @InjectRepository(RatingEntity)
    private readonly repository: Repository<RatingEntity>,
    private readonly productService: ProductService
  ) {
    super(repository)
  }

  /**
   * Method that can create a new rating entity
   * @param createRatingPayload stores the new rating data
   * @returns the created rating entity
   */
  public async create(
    createRatingPayload: CreateRatingPayload
  ): Promise<RatingEntity> {
    const { productId } = createRatingPayload

    // if there is no product the get method will throw an exception
    const product = await this.productService.get(productId)

    return await new RatingEntity({
      ...createRatingPayload,
      productId,
      product
    }).save()
  }
}
