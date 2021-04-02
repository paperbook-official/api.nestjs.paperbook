import { Controller } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'

@ApiTags('shopping-carts')
@Controller('shopping-carts')
export class ShoppingCartController {}
