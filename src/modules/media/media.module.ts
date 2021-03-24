import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { MulterModule } from '@nestjs/platform-express'

import { MulterConfigService } from '../multer-config/services/multer-config.service'
import { MediaService } from './services/media.service'

import { MediaController } from './controllers/media.controller'

import { MulterConfigModule } from '../multer-config/multer-config.module'

@Module({
  imports: [
    ConfigModule,
    MulterModule.registerAsync({
      imports: [MulterConfigModule],
      inject: [MulterConfigService],
      useExisting: MulterConfigService
    })
  ],
  controllers: [MediaController],
  providers: [MediaService]
})
export class MediaModule {}
