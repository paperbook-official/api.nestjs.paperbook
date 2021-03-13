import { Controller, Post, UseGuards } from '@nestjs/common'

import { User } from 'src/decorators/user/user.decorator'

import { LocalGuard } from 'src/guards/local/local.guard'

import { TokenProxy } from '../models/token.proxy'

import { AuthService } from '../services/auth.service'

import { RequestUser } from 'src/utils/type.shared'

/**
 * The app's main auth controller class
 *
 * Class that deals with the auth routes
 */
@Controller('auth')
export class AuthController {
  public constructor(private readonly authService: AuthService) {}

  /**
   * Method that is called when the user access the "/auth/local" route
   * @param requestUser stores the user data who is accessing the route
   * @returns the token data
   */
  @UseGuards(LocalGuard)
  @Post('/local')
  public async signIn(@User() requestUser: RequestUser): Promise<TokenProxy> {
    return this.authService.signIn(requestUser)
  }
}
