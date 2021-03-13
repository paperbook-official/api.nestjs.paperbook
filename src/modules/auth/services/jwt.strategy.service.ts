import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { PassportStrategy } from '@nestjs/passport'

import { RequestUser } from 'src/utils/type.shared'

import { ExtractJwt, Strategy } from 'passport-jwt'

/**
 * The app's main jwt strategy service class
 *
 * Service that deals with the jwt strategry
 */
@Injectable()
export class JwtStrategyService extends PassportStrategy(Strategy) {
  public constructor(configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET_KEY')
    })
  }

  /**
   * Method that extracts from the request the user data
   * @param user stores the user data
   * @returns the user data
   */
  public validate(user: RequestUser): RequestUser {
    return user
  }
}
