import { Module } from '@nestjs/common'

import { MediaController } from './controllers/media.controller'

import { FirebaseModule } from '../firebase/firebase.module'

@Module({
  imports: [FirebaseModule],
  controllers: [MediaController]
})
export class MediaModule {}
