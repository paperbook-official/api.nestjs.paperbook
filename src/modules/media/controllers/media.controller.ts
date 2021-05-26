import { Controller, Post, UploadedFile, UseInterceptors } from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'
import {
  ApiConsumes,
  ApiCreatedResponse,
  ApiOperation,
  ApiTags
} from '@nestjs/swagger'

import { ApiFile } from 'src/decorators/api-file/api-file.decorator'

import { MediaDto } from '../models/media.dto'

import { FirebaseService } from 'src/modules/firebase/services/firebase.service'

/**
 * The app's main media controller class
 *
 * Class that deals with the media routes
 */
@ApiTags('medias')
@Controller('medias')
export class MediaController {
  public constructor(private readonly firebaseService: FirebaseService) {}

  /**
   * Method that is called when the user access the "media/upload"
   * route with "POST" method
   *
   * @param file stores the file sent by the user
   * @returns an object with the file url
   */
  @ApiOperation({ summary: 'Uploads a new file' })
  @ApiCreatedResponse({
    description: 'Gets the uploaded file data',
    type: MediaDto
  })
  @ApiConsumes('multipart/form-data')
  @ApiFile('file')
  @UseInterceptors(FileInterceptor('file'))
  @Post('upload')
  public async upload(
    @UploadedFile() file: Express.Multer.File
  ): Promise<MediaDto> {
    const url = await this.firebaseService.upload(file)
    return {
      url
    }
  }
}
