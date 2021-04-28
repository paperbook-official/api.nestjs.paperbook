import { Body, Controller, Post, UseGuards } from '@nestjs/common'
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger'

import { RequestUser } from 'src/decorators/user/user.decorator'

import { LocalGuard } from 'src/guards/local/local.guard'

import { UserEntity } from 'src/modules/user/entities/user.entity'

import { LoginDto } from '../models/login.dto'
import { TokenDto } from '../models/token.dto'

import { AuthService } from '../services/auth.service'

/**
 * The app's main auth controller class
 *
 * Class that deals with the auth routes
 */
@ApiTags('auth')
@Controller('auth')
export class AuthController {
  public constructor(private readonly authService: AuthService) {}

  /**
   * Method that is called when the user access the "/auth/local" route
   *
   * @param _loginPayload stores the username and the password values
   * @param requestUser stores the user data who is accessing the route
   * @returns the token data
   */
  @ApiOperation({ summary: 'Authenticates the user' })
  @ApiOkResponse({ description: 'Gets the token value', type: TokenDto })
  @UseGuards(LocalGuard)
  @Post('local')
  public async signIn(
    @Body() _loginPayload: LoginDto, // must be here to apply in swagger
    @RequestUser() requestUser: UserEntity
  ): Promise<TokenDto> {
    return this.authService.signIn(requestUser)
  }
}
