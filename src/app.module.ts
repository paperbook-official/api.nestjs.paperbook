import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { MulterModule } from '@nestjs/platform-express'
import { TypeOrmModule } from '@nestjs/typeorm'

import { MulterConfigService } from './modules/multer-config/services/multer-config.service'
import { TypeOrmConfigService } from './modules/typeorm-config/services/typeorm-config.service'

import { AddressModule } from './modules/address/address.module'
import { AuthModule } from './modules/auth/auth.module'
import { MediaModule } from './modules/media/media.module'
import { MulterConfigModule } from './modules/multer-config/multer-config.module'
import { OrderModule } from './modules/order/order.module'
import { ProductModule } from './modules/product/product.module'
import { TypeOrmConfigModule } from './modules/typeorm-config/typeorm-config.module'
import { UserModule } from './modules/user/user.module'

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
    TypeOrmModule.forRootAsync({
      imports: [TypeOrmConfigModule],
      inject: [TypeOrmConfigService],
      useExisting: TypeOrmConfigService
    }),
    MulterModule.registerAsync({
      imports: [MulterConfigModule],
      inject: [MulterConfigService],
      useExisting: MulterConfigService
    })
  ]
})
export class AppModule {}
