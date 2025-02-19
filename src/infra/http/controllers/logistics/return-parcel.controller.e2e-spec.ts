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

describe('Return parcel (E2E)', () => {
  let app: INestApplication
  let prisma: PrismaService
  let parcelFactory: ParcelFactory
  let courierFactory: CourierFactory
  let jwtService: JwtService
  let parcelsRepository: ParcelsRepository

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

    await app.init()
  })

  test('[PATCH] /parcels/:id/return', async () => {
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

    const response = await request(app.getHttpServer())
      .patch(`/parcels/${parcelId}/return`)
      .set('Authorization', `Bearer ${accessToken}`)

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
        status: 'RETURNED',
      }),
    )
  })
})
