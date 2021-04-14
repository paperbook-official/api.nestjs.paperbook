import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'

import { FirebaseService } from './services/firebase.service'

@Module({
  imports: [ConfigModule],
  providers: [FirebaseService],
  exports: [FirebaseService]
})
export class FirebaseModule {}
