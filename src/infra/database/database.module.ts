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
  ],
  exports: [
    PrismaService,
    AdminsRepository,
    CouriersRepository,
    RecipientsRepository,
    ParcelsRepository,
  ],
})
export class DatabaseModule {}
