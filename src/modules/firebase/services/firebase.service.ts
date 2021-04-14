import { Injectable, OnModuleInit } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'

import admin from 'firebase-admin'
import { v4 as uuidv4 } from 'uuid'

@Injectable()
export class FirebaseService implements OnModuleInit {
  public storage: admin.storage.Storage

  public constructor(private readonly configService: ConfigService) {}

  public onModuleInit(): void {
    this.storage = admin
      .initializeApp({
        storageBucket: this.configService.get<string>('FB_STORAGE_BUCKET'),
        credential: admin.credential.cert({
          clientEmail: this.configService.get<string>('FB_CLIENT_EMAIL'),
          privateKey: this.configService
            .get<string>('FB_PRIVATE_KEY')
            .replace(/\\n/g, '\n'),
          projectId: this.configService.get<string>('FB_PROJECT_ID')
        })
      })
      .storage()
  }

  public async upload(multerFile: Express.Multer.File): Promise<string> {
    return new Promise<string>((res, err) => {
      const filename = uuidv4()
      this.storage
        .bucket()
        .file(filename)
        .createWriteStream({
          metadata: {
            contentType: multerFile.mimetype
          }
        })
        .on('finish', async () => {
          res(
            this.storage
              .bucket()
              .file(filename)
              .getSignedUrl({ action: 'read', expires: '01-01-2100' })
              .then(values => values[0])
          )
        })
        .on('error', err)
        .end(multerFile.buffer)
    })
  }
}
