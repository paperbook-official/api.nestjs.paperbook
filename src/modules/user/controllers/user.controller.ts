import { Controller } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { Crud } from '@nestjsx/crud'

import { UserEntity } from '../entities/user.entity'

/**
 * The app's main user controller class
 *
 * Class that deals with the user routes
 */
@Crud({
  model: {
    type: UserEntity
  },
  routes: {
    only: ['getOneBase', 'getManyBase']
  }
})
@ApiTags('users')
@Controller('users')
export class UserController {}
