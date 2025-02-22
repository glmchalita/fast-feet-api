import { DomainEvents } from '@/core/events/domain-events'
import { ParcelsRepository } from '@/domain/delivery/application/repositories/parcels-repository'
import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { FactoriesModule } from 'test/factories/factories.module'
import { CourierFactory } from 'test/factories/make-courier'
import { ParcelFactory } from 'test/factories/make-parcel'
import { RecipientFactory } from 'test/factories/make-recipient'
import { waitFor } from 'test/utils/wait-for'

describe('On parcel updated (E2E)', () => {
  let app: INestApplication
  let prisma: PrismaService
  let courierFactory: CourierFactory
  let recipientFactory: RecipientFactory
  let parcelFactory: ParcelFactory
  let jwt: JwtService
  let parcelsRepository: ParcelsRepository

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule, FactoriesModule],
      providers: [],
    }).compile()

    app = moduleRef.createNestApplication()

    prisma = moduleRef.get(PrismaService)
    courierFactory = moduleRef.get(CourierFactory)
    recipientFactory = moduleRef.get(RecipientFactory)
    parcelFactory = moduleRef.get(ParcelFactory)
    jwt = moduleRef.get(JwtService)
    parcelsRepository = moduleRef.get(ParcelsRepository)

    DomainEvents.shouldRun = true

    await app.init()
  })

  it('should send a notification when a parcel status update', async () => {
    const courier = await courierFactory.makePrismaCourier()

    const courierId = courier.id.toString()

    const accessToken = jwt.sign({ sub: courier.id.toString() })

    const recipient = await recipientFactory.makePrismaRecipient({})

    const parcel = await parcelFactory.makePrismaParcel({ recipientId: recipient.id })

    const parcelId = parcel.id.toString()

    parcel.markReadyForCollect()

    await parcelsRepository.save(parcel)

    await request(app.getHttpServer())
      .post(`/parcels/${parcelId}/collect`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({ courierId })

    await waitFor(async () => {
      const notificationOnDatabase = await prisma.notification.findFirst({
        where: {
          recipientId: recipient.id.toString(),
        },
      })

      expect(notificationOnDatabase).not.toBeNull()
    })
  })
})
