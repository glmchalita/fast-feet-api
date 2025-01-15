import { Module } from '@nestjs/common'
import { DatabaseModule } from '../database/database.module'
import { CreateRecipientService } from '@/domain/delivery/application/services/recipient/create-recipient'
import { CreateRecipientController } from './controllers/recipients/create-recipient.controller'
import { CreateCourierController } from './controllers/courier/create-courier.controller'
import { AuthenticateCourierController } from './controllers/courier/authenticate-courier.controller'
import { CreateCourierService } from '@/domain/delivery/application/services/courier/create-courier.service'
import { AuthenticateCourierService } from '@/domain/delivery/application/services/courier/authenticate-courier.service'
import { CryptographyModule } from '../cryptography/cryptography.module'
import { AuthenticateAdminController } from './controllers/admin/authenticate-admin.controller'
import { AuthenticateAdminService } from '@/domain/delivery/application/services/admin/authenticate-admin.service'
import { DeleteCourierController } from './controllers/courier/delete-courier.controller'
import { UpdateCourierCredentialsController } from './controllers/courier/update-courier-credentials.controller'
import { DeleteCourierService } from '@/domain/delivery/application/services/courier/delete-courier.service'
import { UpdateCourierCredentialsService } from '@/domain/delivery/application/services/courier/update-courier-credentials.service'

@Module({
  imports: [DatabaseModule, CryptographyModule],
  controllers: [
    AuthenticateAdminController,
    CreateCourierController,
    DeleteCourierController,
    UpdateCourierCredentialsController,
    AuthenticateCourierController,
    CreateRecipientController,
  ],
  providers: [
    AuthenticateAdminService,
    CreateCourierService,
    DeleteCourierService,
    UpdateCourierCredentialsService,
    AuthenticateCourierService,
    CreateRecipientService,
  ],
})
export class HttpModule {}
