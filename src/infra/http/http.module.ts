import { Module } from '@nestjs/common'
import { DatabaseModule } from '../database/database.module'
import { CreateRecipientService } from '@/domain/delivery/application/services/recipient/create-recipient'
import { CreateRecipientController } from './controllers/recipients/create-recipient.controller'
import { CreateCourierController } from './controllers/courier/create-courier.controller'
import { AuthenticateCourierController } from './controllers/courier/authenticate-courier.controller'
import { CreateCourierService } from '@/domain/delivery/application/services/courier/create-courier.service'
import { AuthenticateCourierService } from '@/domain/delivery/application/services/courier/authenticate-courier.service'
import { CryptographyModule } from '../cryptography/cryptography.module'

@Module({
  imports: [DatabaseModule, CryptographyModule],
  controllers: [CreateRecipientController, CreateCourierController, AuthenticateCourierController],
  providers: [CreateRecipientService, CreateCourierService, AuthenticateCourierService],
})
export class HttpModule {}
