import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { JwtModule } from '@nestjs/jwt'

import { AuthService } from './services/auth.service'
import { JwtStrategyService } from './services/jwt.strategy.service'
import { LocalStrategyService } from './services/local.strategy.service'

import { AuthController } from './controllers/auth.controller'

import { PasswordModule } from '../password/password.module'

@Module({
  imports: [
    PasswordModule,
    ConfigModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        privateKey: configService.get<string>('JWT_SECRET_KEY')
      })
    })
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategyService, LocalStrategyService],
  exports: [AuthService]
})
export class AuthModule {}
