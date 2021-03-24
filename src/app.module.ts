import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { ServeStaticModule } from '@nestjs/serve-static'
import { TypeOrmModule } from '@nestjs/typeorm'

import { TypeOrmConfigService } from './modules/typeorm-config/services/typeorm-config.service'

import { AddressModule } from './modules/address/address.module'
import { AuthModule } from './modules/auth/auth.module'
import { MediaModule } from './modules/media/media.module'
import { MulterConfigModule } from './modules/multer-config/multer-config.module'
import { OrderModule } from './modules/order/order.module'
import { ProductModule } from './modules/product/product.module'
import { TypeOrmConfigModule } from './modules/typeorm-config/typeorm-config.module'
import { UserModule } from './modules/user/user.module'
import { join } from 'path'

@Module({
  imports: [
    UserModule,
    AuthModule,
    AddressModule,
    ProductModule,
    OrderModule,
    MediaModule,
    MulterConfigModule,
    ConfigModule.forRoot({
      envFilePath: ['.env.local']
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public')
    }),
    TypeOrmModule.forRootAsync({
      imports: [TypeOrmConfigModule],
      inject: [TypeOrmConfigService],
      useExisting: TypeOrmConfigService
    })
  ]
})
export class AppModule {}
