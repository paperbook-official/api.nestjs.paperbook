import { Injectable } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'

/**
 * Guard that protects some route using the "local" strategy
 */
@Injectable()
export class LocalGuard extends AuthGuard('local') {}
