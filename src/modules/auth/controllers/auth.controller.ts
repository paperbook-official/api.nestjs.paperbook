import { Controller, Post, UseGuards } from '@nestjs/common'
import {
  ApiBody,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger'

import { RequestUser } from 'src/decorators/request-user/request-user.decorator'

import { JwtGuard } from 'src/guards/jwt/jwt.guard'
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
   * @param requestUser stores the user data who is accessing the route
   * @returns the token data
   */
  @ApiOperation({ summary: 'Authenticates the user' })
  @ApiOkResponse({
    description: 'Gets the token value',
    type: TokenDto,
  })
  @ApiBody({ type: LoginDto })
  @ApiUnauthorizedResponse({ description: 'User is not authenticated' })
  @UseGuards(LocalGuard)
  @Post('local')
  public async login(
    @RequestUser() requestUser: UserEntity,
  ): Promise<TokenDto> {
    return await this.authService.login(requestUser)
  }

  /**
   * Method that is called when the user access the "/auth/refresh" route
   *
   * @param requestUser stores the user data who is accessing the route
   * @returns the token data
   */
  @ApiOperation({ summary: 'Refreshes the user token' })
  @ApiOkResponse({
    description: 'Gets the token value',
    type: TokenDto,
  })
  @UseGuards(JwtGuard)
  @ApiUnauthorizedResponse({ description: 'User is not authenticated' })
  @Post('refresh')
  public async refresh(
    @RequestUser() requestUser: UserEntity,
  ): Promise<TokenDto> {
    return await this.authService.refresh(requestUser)
  }
}
