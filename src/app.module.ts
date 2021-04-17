import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { TypeOrmModule } from '@nestjs/typeorm'

import { TypeOrmConfigService } from './modules/typeorm-config/services/typeorm-config.service'

import { AddressModule } from './modules/address/address.module'
import { AuthModule } from './modules/auth/auth.module'
import { CategoryModule } from './modules/category/category.module'
import { FirebaseModule } from './modules/firebase/firebase.module'
import { MediaModule } from './modules/media/media.module'
import { OrderModule } from './modules/order/order.module'
import { PasswordModule } from './modules/password/password.module'
import { ProductCategoryModule } from './modules/product-category/product-category.module'
import { ProductModule } from './modules/product/product.module'
import { RatingModule } from './modules/rating/rating.module'
import { SearchModule } from './modules/search/search.module'
import { ShoppingCartModule } from './modules/shopping-cart/shopping-cart.module'
import { TypeOrmConfigModule } from './modules/typeorm-config/typeorm-config.module'
import { UserModule } from './modules/user/user.module'

@Module({
  imports: [
    AuthModule,
    UserModule,
    PasswordModule,
    CategoryModule,
    AddressModule,
    ProductModule,
    OrderModule,
    MediaModule,
    ProductCategoryModule,
    RatingModule,
    ShoppingCartModule,
    SearchModule,
    FirebaseModule,
    ConfigModule.forRoot({
      envFilePath: ['.env']
    }),
    TypeOrmModule.forRootAsync({
      imports: [TypeOrmConfigModule],
      inject: [TypeOrmConfigService],
      useExisting: TypeOrmConfigService
    })
  ]
})
export class AppModule {}
