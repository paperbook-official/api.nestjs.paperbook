import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm'

import * as path from 'path'

/**
 * The app's main typeorm config service class
 *
 * Class that deals with the typeorm setup
 */
@Injectable()
export class TypeOrmConfigService implements TypeOrmOptionsFactory {
  public constructor(private readonly configService: ConfigService) {}

  /**
   * Method to create the typeorm settings
   *
   * @returns an objects with the options
   */
  public createTypeOrmOptions(): TypeOrmModuleOptions {
    const entitiesPath = path.resolve(
      path.dirname(require.main.filename),
      '**',
      '*.entity.js'
    )

    switch (this.configService.get<'sqlite' | 'postgres'>('DATABASE_TYPE')) {
      case 'sqlite':
        return {
          type: 'sqlite',
          synchronize: this.configService.get<boolean>('DATABASE_SYNCHRONIZE'),
          database: this.configService.get<string>('DATABASE_DATABASE'),
          migrationsRun: this.configService.get<boolean>(
            'DATABASE_MIGRATIONS_RUN'
          ),
          entities: [entitiesPath]
        }
        break
      case 'postgres':
        return {
          type: 'postgres',
          url: this.configService.get<string>('DATABASE_URL'),
          synchronize: this.configService.get<boolean>('DATABASE_SYNCHRONIZE'),
          migrationsRun: this.configService.get<boolean>(
            'DATABASE_MIGRATIONS_RUN'
          ),
          ssl: this.configService.get<boolean>('DATABASE_SSL'),
          entities: [entitiesPath]
        }
        break
    }
  }
}
