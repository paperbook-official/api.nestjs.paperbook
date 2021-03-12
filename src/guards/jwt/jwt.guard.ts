import { Injectable } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'

/**
 * Guard that protects some route using the "jwt" strategy
 */
@Injectable()
export class JwtGuard extends AuthGuard('jwt') {}
