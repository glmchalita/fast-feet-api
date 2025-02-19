import { Module } from '@nestjs/common'
import { PrismaService } from './prisma/prisma.service'
import { CouriersRepository } from '@/domain/delivery/application/repositories/couriers-repository'
import { PrismaCouriersRepository } from './prisma/repositories/prisma-couriers-repository'
import { RecipientsRepository } from '@/domain/delivery/application/repositories/recipients-repository'
import { PrismaRecipientsRepository } from './prisma/repositories/prisma-recipients-repository'
import { ParcelsRepository } from '@/domain/delivery/application/repositories/parcels-repository'
import { PrismaParcelsRepository } from './prisma/repositories/prisma-parcels-repository'
import { AdminsRepository } from '@/domain/delivery/application/repositories/admin-repository'
import { PrismaAdminsRepository } from './prisma/repositories/prisma-admins-repository'
import { AttachmentsRepository } from '@/domain/delivery/application/repositories/attachments-repository'
import { PrismaAttachmentsRepository } from './prisma/repositories/prisma-attachments-repository'
import { ParcelAttachmentRepository } from '@/domain/delivery/application/repositories/parcel-attachment-repository'
import { PrismaParcelAttachmentRepository } from './prisma/repositories/prisma-parcel-attachments-repository'

@Module({
  providers: [
    PrismaService,
    {
      provide: AdminsRepository,
      useClass: PrismaAdminsRepository,
    },
    {
      provide: CouriersRepository,
      useClass: PrismaCouriersRepository,
    },
    {
      provide: RecipientsRepository,
      useClass: PrismaRecipientsRepository,
    },
    {
      provide: ParcelsRepository,
      useClass: PrismaParcelsRepository,
    },
    {
      provide: AttachmentsRepository,
      useClass: PrismaAttachmentsRepository,
    },
    {
      provide: ParcelAttachmentRepository,
      useClass: PrismaParcelAttachmentRepository,
    },
  ],
  exports: [
    PrismaService,
    AdminsRepository,
    CouriersRepository,
    RecipientsRepository,
    ParcelsRepository,
    AttachmentsRepository,
    ParcelAttachmentRepository,
  ],
})
export class DatabaseModule {}
