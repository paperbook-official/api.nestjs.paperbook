import { Injectable } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'

/**
 * The app's main local guard class
 *
 * Guard that protects some route using the "local" strategy
 */
@Injectable()
export class LocalGuard extends AuthGuard('local') {}
