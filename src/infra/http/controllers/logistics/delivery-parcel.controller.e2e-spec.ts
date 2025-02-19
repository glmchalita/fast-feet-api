import { ParcelsRepository } from '@/domain/delivery/application/repositories/parcels-repository'
import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { FactoriesModule } from 'test/factories/factories.module'
import { AttachmentFactory } from 'test/factories/make-attachment'
import { CourierFactory } from 'test/factories/make-courier'
import { ParcelFactory } from 'test/factories/make-parcel'

describe('Return parcel (E2E)', () => {
  let app: INestApplication
  let prisma: PrismaService
  let parcelFactory: ParcelFactory
  let courierFactory: CourierFactory
  let jwtService: JwtService
  let parcelsRepository: ParcelsRepository
  let attachmentFactory: AttachmentFactory

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule, FactoriesModule],
      providers: [JwtService],
    }).compile()

    app = moduleRef.createNestApplication()

    prisma = moduleRef.get(PrismaService)
    parcelFactory = moduleRef.get(ParcelFactory)
    courierFactory = moduleRef.get(CourierFactory)
    jwtService = moduleRef.get(JwtService)
    parcelsRepository = moduleRef.get(ParcelsRepository)
    attachmentFactory = moduleRef.get(AttachmentFactory)

    await app.init()
  })

  test('[PATCH] /parcels/:id/delivery', async () => {
    const parcel = await parcelFactory.makePrismaParcel()

    const parcelId = parcel.id.toString()

    parcel.markReadyForCollect()

    await parcelsRepository.save(parcel)

    parcel.markCollected()

    await parcelsRepository.save(parcel)

    parcel.markOutForDelivery()

    await parcelsRepository.save(parcel)

    const courier = await courierFactory.makePrismaCourier()

    const courierId = courier.id.toString()

    const accessToken = jwtService.sign({ sub: courierId })

    const attachment = await attachmentFactory.makePrismaAttachment()

    const attachmentId = attachment.id.toString()

    const response = await request(app.getHttpServer())
      .patch(`/parcels/${parcelId}/delivery`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({ attachmentId })

    expect(response.statusCode).toBe(200)

    const parcelOnDatabase = await prisma.parcel.findFirst({
      where: { id: parcelId },
    })

    expect(parcelOnDatabase).toBeTruthy()

    const statusHistory = await prisma.statusHistory.findFirst({
      where: {
        parcelId,
      },
      orderBy: {
        date: 'desc',
      },
    })

    expect(statusHistory).toEqual(
      expect.objectContaining({
        status: 'DELIVERED',
      }),
    )

    const attachmentOnDatabase = await prisma.attachment.findFirst({
      where: {
        parcelId: parcelOnDatabase?.id,
      },
    })

    expect(attachmentOnDatabase).toBeTruthy()
  })
})
