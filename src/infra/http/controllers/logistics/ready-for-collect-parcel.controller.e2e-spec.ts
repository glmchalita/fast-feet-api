import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { FactoriesModule } from 'test/factories/factories.module'
import { AdminFactory } from 'test/factories/make-admin'
import { ParcelFactory } from 'test/factories/make-parcel'

describe('Ready for collect parcel (E2E)', () => {
  let app: INestApplication
  let prisma: PrismaService
  let parcelFactory: ParcelFactory
  let adminFactory: AdminFactory
  let jwtService: JwtService

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule, FactoriesModule],
      providers: [JwtService],
    }).compile()

    app = moduleRef.createNestApplication()

    prisma = moduleRef.get(PrismaService)
    parcelFactory = moduleRef.get(ParcelFactory)
    adminFactory = moduleRef.get(AdminFactory)
    jwtService = moduleRef.get(JwtService)

    await app.init()
  })

  test('[PATCH] /parcels/:id/ready-for-collect', async () => {
    const parcel = await parcelFactory.makePrismaParcel()

    const parcelId = parcel.id.toString()

    const admin = await adminFactory.makePrismaAdmin()

    const adminId = admin.id.toString()

    const accessToken = jwtService.sign({ sub: adminId })

    const response = await request(app.getHttpServer())
      .patch(`/parcels/${parcelId}/ready-for-collect`)
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
        status: 'READY_FOR_COLLECT',
      }),
    )
  })
})
