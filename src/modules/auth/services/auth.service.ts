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
  public async login(requestUser: UserEntity): Promise<TokenDto> {
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
    return await this.login(user)
  }

  /**
   * Method that validates if the user exists in the database and if
   * the password that is passing in parameters matches with the one in the
   * saved
   *
   * @param loginPayload stores the data that will be tested
   * @returns the found user entity
   */
  public async authenticate(loginPayload: LoginDto): Promise<UserEntity> {
    const { email, password } = loginPayload

    const entity = await UserEntity.findOne({ email })

    if (!entity) {
      throw new UnauthorizedException(
        'You have no permission to access those sources'
      )
    }

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

  /**
   * Method that validates the jwt request user and ensures that this user
   * exists and he is not disabled
   *
   * @param user stores the jwt request user
   * @returns the user himself if exists and he is not disabled
   */
  public async validateJwtUser(user: UserEntity): Promise<UserEntity> {
    const entity = await UserEntity.findOne({ id: user.id })

    if (!entity || !entity.isActive) {
      throw new UnauthorizedException(
        'You have no permission to access those sources'
      )
    }

    return entity
  }
}
