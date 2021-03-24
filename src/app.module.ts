import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { TypeOrmModule } from '@nestjs/typeorm'

import { TypeOrmConfigService } from './modules/typeorm-config/services/typeorm-config.service'

import { AddressModule } from './modules/address/address.module'
import { AuthModule } from './modules/auth/auth.module'
import { OrderModule } from './modules/order/order.module'
import { ProductModule } from './modules/product/product.module'
import { TypeOrmConfigModule } from './modules/typeorm/typeorm-config.module'
import { UserModule } from './modules./modules/typeorm-config/typeorm-config.module

@Module({
  imports: [
    UserModule,
    AuthModule,
    AddressModule,
    ProductModule,
    OrderModule,
    TypeOrmModule.forRootAsync({
      imports: [TypeOrmConfigModule],
      inject: [TypeOrmConfigService],
      useExisting: TypeOrmConfigService
    }),
    ConfigModule.forRoot({
      envFilePath: ['.env.local']
    })
  ]
})
export class AppModule {}
