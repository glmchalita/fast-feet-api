import { Module } from '@nestjs/common'
import { ParcelFactory } from './make-parcel'
import { RecipientFactory } from './make-recipient'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { AdminFactory } from './make-admin'
import { CourierFactory } from './make-courier'
import { AttachmentFactory } from './make-attachment'

@Module({
  providers: [
    AdminFactory,
    CourierFactory,
    RecipientFactory,
    ParcelFactory,
    AttachmentFactory,
    PrismaService,
  ],
  exports: [AdminFactory, CourierFactory, RecipientFactory, ParcelFactory, AttachmentFactory],
})
export class FactoriesModule {}
