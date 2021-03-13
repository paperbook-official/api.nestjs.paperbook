import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm'

import * as path from 'path'

@Injectable()
export class TypeOrmConfigService implements TypeOrmOptionsFactory {
  public constructor(private readonly configService: ConfigService) {}

  public createTypeOrmOptions(): TypeOrmModuleOptions {
    const entitiesPath = path.resolve(
      path.dirname(require.main.filename),
      '**',
      '*.entity.js'
    )

    switch (this.configService.get<'sqlite' | 'postgres'>('DB_TYPE')) {
      case 'sqlite':
        return {
          type: 'sqlite',
          synchronize: this.configService.get<boolean>('DB_SYNCHRONIZE'),
          database: this.configService.get<string>('DB_DATABASE'),
          migrationsRun: this.configService.get<boolean>('DB_MIGRATIONS_RUN'),
          entities: [entitiesPath]
        }
      case 'postgres':
        return {
          type: 'postgres',
          port: this.configService.get<number>('DB_PORT'),
          host: this.configService.get<string>('DB_HOST'),
          username: this.configService.get<string>('DB_USERNAME'),
          password: this.configService.get<string>('DB_PASSWORD'),
          synchronize: this.configService.get<boolean>('DB_SYNCHRONIZE'),
          migrationsRun: this.configService.get<boolean>('DB_MIGRATIONS_RUN'),
          entities: [entitiesPath]
        }
    }
  }
}
