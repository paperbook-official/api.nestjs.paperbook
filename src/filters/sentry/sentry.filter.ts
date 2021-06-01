import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus
} from '@nestjs/common'
import { ConfigService } from '@nestjs/config'

import * as Sentry from '@sentry/node'
import { Request, Response } from 'express'

/**
 * The app's main sentry filter class
 *
 * Class that capture some exception and send it to sentry.io
 */
@Catch()
export class SentryFilter implements ExceptionFilter {
  public constructor(configService: ConfigService) {
    Sentry.init({
      environment: configService.get<string>('NODE_ENV'),
      dsn: configService.get<string>('SENTRY_DSN'),
      release: configService.get<string>('PACKAGE_VERSION')
    })
  }

  /**
   * Method that deals with the thrown exceptions
   *
   * @param exception stores the thrown exception
   * @param host stores the host arguments
   */
  public async catch(
    exception: HttpException,
    host: ArgumentsHost
  ): Promise<void> {
    const context = host.switchToHttp()
    const response = context.getResponse<Response>()
    const request = context.getRequest<Request>()

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR

    Sentry.setContext('request', { requestUrl: request.url })

    if (status >= 500) {
      Sentry.captureException(exception)
    }

    response.status(status).json(exception.getResponse())
  }
}
