import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { MulterModule } from '@nestjs/platform-express'
import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface'

import { MediaService } from './services/media.service'

import { MediaController } from './controllers/media.controller'

@Module({
  imports: [
    ConfigModule,
    MulterModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService): MulterOptions => {
        return {
          dest: configService.get<string>('MULTER_DEST'),
          preservePath: configService.get<boolean>('MULTER_PRESERVE_PATH')
        }
      }
    })
  ],
  controllers: [MediaController],
  providers: [MediaService]
})
export class MediaModule {}
