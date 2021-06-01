import { INestApplication, ValidationPipe } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { NestFactory } from '@nestjs/core'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'

import { AppModule } from './app.module'
import { SentryFilter } from './filters/sentry/sentry.filter'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)

  const configService = app.get(ConfigService)

  setupPipes(app)
  setupFilters(app, configService)
  setupSwagger(app, configService)

  app.enableCors()

  await app.listen(configService.get<number>('PORT') || 3000)
}

bootstrap()

//#region Setup

/**
 * Function that set the global pipes to the application
 *
 * @param app stores the application instance
 */
function setupPipes(app: INestApplication): void {
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true
    })
  )
}

/**
 * Function that set the filters to the application
 *
 * @param app stores the application instance
 * @param configService stores the application settings
 */
function setupFilters(
  app: INestApplication,
  configService: ConfigService
): void {
  app.useGlobalFilters(new SentryFilter(configService))
}

/**
 * Function that set the swagger to the application
 *
 * @param app stores the application instance
 * @param configService stores the application settings
 */
function setupSwagger(
  app: INestApplication,
  configService: ConfigService
): void {
  const config = new DocumentBuilder()
    .setTitle(configService.get<string>('SWAGGER_TITLE'))
    .setDescription(configService.get<string>('SWAGGER_DESCRIPTION'))
    .setVersion(configService.get<string>('SWAGGER_VERSION'))
    .addTag(configService.get<string>('SWAGGER_TAG'))
    .addBearerAuth()
    .build()

  const document = SwaggerModule.createDocument(app, config)

  SwaggerModule.setup(`swagger`, app, document)
}

//#endregion
