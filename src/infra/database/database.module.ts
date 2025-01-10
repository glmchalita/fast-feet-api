import { Module } from '@nestjs/common'
import { PrismaService } from './prisma/prisma.service'
import { CouriersRepository } from '@/domain/delivery/application/repositories/couriers-repository'
import { PrismaCouriersRepository } from './prisma/repositories/prisma-couriers-repository'
import { RecipientsRepository } from '@/domain/delivery/application/repositories/recipients-repository'
import { PrismaRecipientsRepository } from './prisma/repositories/prisma-recipients-repository'
import { ParcelsRepository } from '@/domain/delivery/application/repositories/parcels-repository'
import { PrismaParcelsRepository } from './prisma/repositories/prisma-parcels-repository'

@Module({
  providers: [
    PrismaService,
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
  exports: [PrismaService, CouriersRepository, RecipientsRepository, ParcelsRepository],
})
export class DatabaseModule {}
