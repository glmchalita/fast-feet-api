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

describe('Delete parcel (E2E)', () => {
  let app: INestApplication
  let prisma: PrismaService
  let adminFactory: AdminFactory
  let jwtService: JwtService
  let parcelFactory: ParcelFactory

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule, FactoriesModule],
      providers: [JwtService],
    }).compile()

    app = moduleRef.createNestApplication()

    prisma = moduleRef.get(PrismaService)
    adminFactory = moduleRef.get(AdminFactory)
    jwtService = moduleRef.get(JwtService)
    parcelFactory = moduleRef.get(ParcelFactory)

    await app.init()
  })

  test('[DELETE] /parcels/:id', async () => {
    const admin = await adminFactory.makePrismaAdmin()

    const accessToken = jwtService.sign({ sub: admin.id.toString() })

    const parcel = await parcelFactory.makePrismaParcel()

    const parcelId = parcel.id.toString()

    const response = await request(app.getHttpServer())
      .delete(`/parcels/${parcelId}`)
      .set('Authorization', `Bearer ${accessToken}`)

    expect(response.statusCode).toBe(204)

    const courierOnDatabase = await prisma.parcel.findFirst({
      where: {
        id: parcelId,
      },
    })

    expect(courierOnDatabase).toBeNull()
  })
})
