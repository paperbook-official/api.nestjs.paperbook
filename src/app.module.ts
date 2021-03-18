import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { TypeOrmModule } from '@nestjs/typeorm'

import { TypeOrmConfigService } from './modules/typeorm/services/typeorm-config.service'

import { AddressModule } from './modules/address/address.module'
import { AuthModule } from './modules/auth/auth.module'
import { TypeOrmConfigModule } from './modules/typeorm/typeorm-config.module'
import { UserModule } from './modules/user/user.module'
import { CategoryModule } from './modules/category/category.module'

@Module({
  imports: [
    UserModule,
    AddressModule,
    AuthModule,
    CategoryModule,
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
