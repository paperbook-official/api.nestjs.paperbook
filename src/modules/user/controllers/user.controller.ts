import { Controller } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'

/**
 * The app's main user controller class
 *
 * Class that deals with the user routes
 */
@ApiTags('users')
@Controller('users')
export class UserController {}
