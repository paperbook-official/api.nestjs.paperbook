import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'

import { TypeOrmConfigService } from './services/typeorm-config.service'

@Module({
  imports: [ConfigModule],
  providers: [TypeOrmConfigService],
  exports: [TypeOrmConfigService]
})
export class TypeOrmConfigModule {}
