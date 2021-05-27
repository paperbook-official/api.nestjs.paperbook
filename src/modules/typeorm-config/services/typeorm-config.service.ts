import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm'

import * as fs from 'fs'
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

    let options: TypeOrmModuleOptions
    switch (this.configService.get<'sqlite' | 'postgres'>('DATABASE_TYPE')) {
      case 'sqlite':
        options = {
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
        options = {
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

    this.loadConfig(options)

    return options
  }

  /**
   * Method that generates a file with the migration settings
   *
   * @param options stores the database current config data
   */
  private loadConfig(options: TypeOrmModuleOptions): void {
    try {
      fs.unlinkSync('ormconfig.json')
    } catch {}
    fs.writeFileSync(
      'ormconfig.json',
      JSON.stringify(
        {
          ...options,
          entities: ['**/*.entity.ts'],
          migrations: ['src/migrations/*.ts']
        },
        null,
        4
      )
    )
  }
}
