import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { JwtSignOptions } from '@nestjs/jwt'
import { PassportStrategy } from '@nestjs/passport'

import { UserEntity } from 'src/modules/user/entities/user.entity'

import { ExtractJwt, Strategy } from 'passport-jwt'

/**
 * The app's main jwt strategy service class
 *
 * Service that deals with the jwt strategy
 */
@Injectable()
export class JwtStrategyService extends PassportStrategy(Strategy) {
  public constructor(configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET_KEY')
    } as JwtSignOptions)
  }

  /**
   * Method that extracts from the request the user data
   *
   * @param user stores the user data
   * @returns the user data
   */
  public validate(user: UserEntity): UserEntity {
    return user
  }
}
