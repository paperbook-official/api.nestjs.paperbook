import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'

import { MulterConfigService } from './services/multer-config.service'

@Module({
  imports: [ConfigModule],
  providers: [MulterConfigService],
  exports: [MulterConfigService]
})
export class MulterConfigModule {}
