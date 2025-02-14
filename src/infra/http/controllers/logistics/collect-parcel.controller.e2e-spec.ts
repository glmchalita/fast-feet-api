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

describe('Collect parcel (E2E)', () => {
  let app: INestApplication
  let prisma: PrismaService
  let parcelFactory: ParcelFactory
  let courierFactory: CourierFactory
  let jwtService: JwtService

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

    await app.init()
  })

  test('[PATCH] /parcels/:id', async () => {
    const parcel = await parcelFactory.makePrismaParcel()

    const parcelId = parcel.id.toString()

    const courier = await courierFactory.makePrismaCourier()

    const courierId = courier.id.toString()

    const accessToken = jwtService.sign({ sub: courierId })

    const response = await request(app.getHttpServer())
      .patch(`/parcels/${parcelId}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({ courierId })

    expect(response.statusCode).toBe(200)

    const parcelOnDatabase = await prisma.parcel.findFirst({
      where: { courierId },
    })

    expect(parcelOnDatabase).toBeTruthy()

    const statusHistory = await prisma.statusHistory.findFirst({
      where: {
        parcel: {
          courierId,
        },
      },
      include: {
        parcel: true,
      },
    })

    expect(statusHistory).toEqual(
      expect.objectContaining({
        status: 'COLLECTED',
        parcel: expect.objectContaining({
          courierId,
        }),
      }),
    )
  })
})
