import { Controller } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { Crud } from '@nestjsx/crud'

import { RatingProxy } from '../models/rating.proxy'

@Crud({
  model: {
    type: RatingProxy
  }
})
@ApiTags('rating')
@Controller('rating')
export class RatingController {}
