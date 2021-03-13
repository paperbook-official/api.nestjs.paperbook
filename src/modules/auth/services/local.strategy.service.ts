import { Injectable } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'

import { AuthService } from './auth.service'

import { RequestUser } from 'src/utils/type.shared'

import { Strategy } from 'passport-local'

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
    })
  }

  /**
   * Method that validates if the user that want to connect exists in the database
   * @param username stores the email data
   * @param password stores the password data
   * @returns the user data
   */
  public async validate(
    username: string,
    password: string
  ): Promise<RequestUser> {
    return this.authService.authenticate({ password, email: username })
  }
}
