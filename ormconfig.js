let options

switch (process.env.DATABASE_TYPE) {
  case 'sqlite':
    options = {
      type: 'sqlite',
      synchronize: process.env.DATABASE_SYNCHRONIZE === 'true',
      database: process.env.DATABASE_DATABASE,
      migrationsRun: process.env.DATABASE_MIGRATIONS_RUN === 'true',
      entities: ['**/*.entity.ts'],
      migrations: ['src/migrations/*.ts']
    }
    break
  case 'postgres':
    options = {
      type: 'postgres',
      url: process.env.DATABASE_URL,
      synchronize: process.env.DATABASE_SYNCHRONIZE === 'true',
      migrationsRun: process.env.DATABASE_MIGRATIONS_RUN === 'true',
      ssl: process.env.DATABASE_SSL === 'true',
      entities: ['**/*.entity.ts'],
      migrations: ['src/migrations/*.ts']
    }
    break
}

export default options
