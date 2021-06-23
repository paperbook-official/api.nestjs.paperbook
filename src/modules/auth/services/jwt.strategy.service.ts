import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { JwtSignOptions } from '@nestjs/jwt'
import { PassportStrategy } from '@nestjs/passport'

import { UserEntity } from 'src/modules/user/entities/user.entity'

import { AuthService } from './auth.service'

import { ExtractJwt, Strategy } from 'passport-jwt'

/**
 * The app's main jwt strategy service class
 *
 * Service that deals with the jwt strategy
 */
@Injectable()
export class JwtStrategyService extends PassportStrategy(Strategy) {
  public constructor(
    configService: ConfigService,
    private readonly authService: AuthService
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET_KEY'),
      expiresIn: configService.get<string>('7d')
    } as JwtSignOptions)
  }

  /**
   * Method that extracts from the request the user data
   *
   * @param user stores the user data
   * @throws {UnauthorizedException} if the informed token has no valid user or the entity is disabled
   * @returns the user data
   */
  public async validate(user: UserEntity): Promise<UserEntity> {
    return await this.authService.validateJwtUser(user)
  }
}
