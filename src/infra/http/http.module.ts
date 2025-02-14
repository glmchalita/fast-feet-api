import { Module } from '@nestjs/common'
import { DatabaseModule } from '../database/database.module'
import { CreateRecipientService } from '@/domain/delivery/application/services/recipient/create-recipient.service'
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
import { DeleteRecipientController } from './controllers/recipients/delete-recipient.controller'
import { UpdateRecipientAddressController } from './controllers/recipients/update-recipient-address.controllet'
import { DeleteRecipientService } from '@/domain/delivery/application/services/recipient/delete-recipient.service'
import { UpdateRecipientAddressService } from '@/domain/delivery/application/services/recipient/update-recipient-address.service'
import { CreateParcelController } from './controllers/parcel/create-parcel.controller'
import { CreateParcelService } from '@/domain/delivery/application/services/parcel/create-parcel.service'
import { DeleteParcelController } from './controllers/parcel/delete-parcel.controller'
import { DeleteParcelService } from '@/domain/delivery/application/services/parcel/delete-parcel.service'
import { UpdateParcelCourierController } from './controllers/parcel/update-parcel-courier.controller'
import { UpdateParcelCourierService } from '@/domain/delivery/application/services/parcel/update-parcel-courier.service'
import { CollectParcelController } from './controllers/logistics/collect-parcel.controller'
import { CollectParcelService } from '@/domain/delivery/application/services/logistics/collect-parcel.service'

@Module({
  imports: [DatabaseModule, CryptographyModule],
  controllers: [
    AuthenticateAdminController,
    CreateCourierController,
    DeleteCourierController,
    UpdateCourierCredentialsController,
    AuthenticateCourierController,
    CreateRecipientController,
    DeleteRecipientController,
    UpdateRecipientAddressController,
    CreateParcelController,
    DeleteParcelController,
    UpdateParcelCourierController,
    CollectParcelController,
  ],
  providers: [
    AuthenticateAdminService,
    CreateCourierService,
    DeleteCourierService,
    UpdateCourierCredentialsService,
    AuthenticateCourierService,
    CreateRecipientService,
    DeleteRecipientService,
    UpdateRecipientAddressService,
    CreateParcelService,
    DeleteParcelService,
    UpdateParcelCourierService,
    CollectParcelService,
  ],
})
export class HttpModule {}
