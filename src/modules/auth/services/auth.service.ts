import { Injectable, UnauthorizedException } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { JwtService } from '@nestjs/jwt'

import { UserEntity } from 'src/modules/user/entities/user.entity'

import { LoginPayload } from '../models/login.payload'
import { TokenProxy } from '../models/token.proxy'

import { comparePassword } from 'src/utils/password'
import { RequestUser } from 'src/utils/type.shared'

/**
 * The app's main auth service service class
 *
 * Class that deals with the authentication
 */
@Injectable()
export class AuthService {
  public constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService
  ) {}

  /**
   * Method that signs the user based in him data
   * @param requestUser stores the user data
   * @returns the token
   */
  public async signIn(requestUser: RequestUser): Promise<TokenProxy> {
    const expiresIn = this.configService.get<string>('JWT_EXPIRES_IN')

    const { id, email, roles } = requestUser

    const token = await this.jwtService.signAsync(
      {
        id,
        email,
        roles
      },
      { expiresIn }
    )
    return { token, expiresIn }
  }

  /**
   * Method that validates if the user exists in the database and if
   * the password that is passing in parameters matches with the one in the
   * saved
   * @param loginPayload stores the data that will be tested
   */
  public async authenticate(loginPayload: LoginPayload): Promise<UserEntity> {
    const { email, password } = loginPayload

    const entity = await UserEntity.findOne({ email })

    if (!entity)
      throw new UnauthorizedException(
        'You have no permission to access those sources'
      )

    const passwordMatches = await comparePassword(password, entity.password)

    if (!passwordMatches)
      throw new UnauthorizedException(
        'You have no permission to access those sources'
      )

    return entity
  }
}
