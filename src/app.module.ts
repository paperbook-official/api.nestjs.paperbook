import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { TypeOrmModule } from '@nestjs/typeorm'

import { AuthModule } from './modules/auth/auth.module'
import { UserModule } from './modules/user/user.module'

@Module({
  imports: [
    UserModule,
    AuthModule,
    TypeOrmModule.forRoot(),
    ConfigModule.forRoot({
      envFilePath: ['.env.development']
    })
  ]
})
export class AppModule {}
