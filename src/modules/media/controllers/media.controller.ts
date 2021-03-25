import {
  Controller,
  Post,
  Put,
  UploadedFile,
  UseInterceptors
} from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'
import {
  ApiConsumes,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags
} from '@nestjs/swagger'

import { ApiFile } from 'src/decorators/api-file/api-file.decorator'
import { ProtectTo } from 'src/decorators/protect-to/protect-to.decorator'

import { MediaProxy } from '../models/media.proxy'

import { MediaService } from '../services/media.service'

import { RolesEnum } from 'src/models/enums/roles.enum'

/**
 * The app's main media controller class
 *
 * Class that deals with the media routes
 */
@ApiTags('media')
@Controller('media')
export class MediaController {
  public constructor(private readonly mediaService: MediaService) {}

  /**
   * Method that is called when the user access the "media/upload"
   * route with "POST" method
   * @param file stores the file sent by the user
   * @returns an object with the file url
   */
  @ApiOperation({ summary: 'Uploads a new file' })
  @ApiCreatedResponse({
    description: 'Gets the uploaded file data',
    type: MediaProxy
  })
  @ApiConsumes('multipart/form-data')
  @ApiFile('file')
  @ProtectTo(RolesEnum.Admin, RolesEnum.Seller)
  @UseInterceptors(FileInterceptor('file'))
  @Post('upload')
  public upload(@UploadedFile() file: Express.Multer.File): MediaProxy {
    return {
      url: this.mediaService.upload(file)
    }
  }

  /**
   * Method that is called when the user access the "media/clear"
   * route with "PUT" method
   */
  @ApiOperation({ summary: 'Clears the stored images' })
  @ApiOkResponse({
    description: 'All the images were deleted',
    type: MediaProxy
  })
  @ProtectTo(RolesEnum.Admin)
  @Put('clear')
  public async clear(): Promise<void> {
    await this.mediaService.clear()
  }
}
