import { Injectable, InternalServerErrorException } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'

import { join } from 'path'
import * as rimraf from 'rimraf'

/**
 * The app's main media service class
 *
 * Class that deals with the stored files
 */
@Injectable()
export class MediaService {
  public constructor(private readonly configService: ConfigService) {}

  /**
   * Method that, passing the file, returns the file url
   * @param file stores the uploaded file
   * @returns the file url
   */
  public upload(file: Express.Multer.File): string {
    console.log(file.path)
    console.log(this.configService.get<string>('API_BASE_PATH'))

    return join(
      this.configService.get<string>('API_BASE_PATH'),
      file.path
    ).replace('/public', '')
  }

  /**
   * Method that deletes all the saved images
   */
  public async clear(): Promise<void> {
    rimraf(join(__dirname, '..', '..', '..', '..', 'public'), error => {
      throw new InternalServerErrorException(error)
    })
  }
}
