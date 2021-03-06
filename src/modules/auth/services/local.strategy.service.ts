import { Injectable } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'

import { UserEntity } from 'src/modules/user/entities/user.entity'

import { AuthService } from './auth.service'

import { Strategy, IStrategyOptions } from 'passport-local'

/**
 * The app's main local strategy service class
 *
 * Service that deals with the local strategy
 */
@Injectable()
export class LocalStrategyService extends PassportStrategy(Strategy) {
  public constructor(private readonly authService: AuthService) {
    super({
      usernameField: 'email',
      passwordField: 'password'
    } as IStrategyOptions)
  }

  /**
   * Method that validates if the user that want to connect exists in the database
   *
   * @param username stores the email data
   * @param password stores the password data
   * @throws {UnauthorizedException} if the user passed the wrong username or password
   * @returns the user data
   */
  public async validate(
    username: string,
    password: string
  ): Promise<UserEntity> {
    return this.authService.authenticate({ email: username, password })
  }
}
