import { Injectable, UnauthorizedException } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { JwtService } from '@nestjs/jwt'

import { UserEntity } from 'src/modules/user/entities/user.entity'

import { LoginDto } from '../models/login.dto'
import { TokenDto } from '../models/token.dto'

import { PasswordService } from 'src/modules/password/services/password.service'

/**
 * The app's main auth service service class
 *
 * Class that deals with the authentication
 */
@Injectable()
export class AuthService {
  public constructor(
    private readonly passwordService: PasswordService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService
  ) {}

  /**
   * Method that signs the user based in him data
   *
   * @param requestUser stores the user data
   * @returns the token data
   */
  public async signIn(requestUser: UserEntity): Promise<TokenDto> {
    const expiresIn = this.configService.get<string>('JWT_EXPIRES_IN')

    const { id, email, name, roles, cpf, isActive } = requestUser

    const token = await this.jwtService.signAsync(
      { id, email, name, roles, cpf, isActive },
      { expiresIn }
    )
    return { token, expiresIn }
  }

  /**
   * Method that refreshes the logged user token
   *
   * @param requestUser stores the logged user data
   * @returns the token data
   */
  public async refresh(requestUser: UserEntity): Promise<TokenDto> {
    const user = await UserEntity.findOne({ id: requestUser.id })
    return await this.signIn(user)
  }

  /**
   * Method that validates if the user exists in the database and if
   * the password that is passing in parameters matches with the one in the
   * saved
   *
   * @param loginPayload stores the data that will be tested
   */
  public async authenticate(loginPayload: LoginDto): Promise<UserEntity> {
    const { email, password } = loginPayload

    const entity = await UserEntity.findOne({ email })

    if (!entity)
      throw new UnauthorizedException(
        'You have no permission to access those sources'
      )

    const passwordMatches = await this.passwordService.comparePassword(
      password,
      entity.password
    )

    if (!passwordMatches)
      throw new UnauthorizedException(
        'You have no permission to access those sources'
      )

    return entity
  }
}
