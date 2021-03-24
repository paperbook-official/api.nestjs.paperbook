import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { MulterOptionsFactory } from '@nestjs/platform-express'
import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface'

/**
 * The app's main multer config service class
 *
 * Class that deals with the multer setup
 */
@Injectable()
export class MulterConfigService implements MulterOptionsFactory {
  public constructor(private readonly configService: ConfigService) {}

  /**
   * Method to create the multer options
   * @returns an object with the multer options
   */
  public createMulterOptions(): MulterOptions {
    return {
      dest: this.configService.get<string>('MULTER_DEST'),
      preservePath: this.configService.get<boolean>('MULTER_PRESERVE_PATH')
    }
  }
}
