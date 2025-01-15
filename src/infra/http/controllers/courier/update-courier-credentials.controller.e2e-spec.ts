import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { AdminFactory } from 'test/factories/make-admin'
import { CourierFactory } from 'test/factories/make-courier'

describe('Update courier credentials (E2E)', () => {
  let app: INestApplication
  let prisma: PrismaService
  let adminFactory: AdminFactory
  let jwtService: JwtService
  let courierFactory: CourierFactory

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [AdminFactory, JwtService, CourierFactory],
    }).compile()

    app = moduleRef.createNestApplication()
    prisma = moduleRef.get(PrismaService)
    adminFactory = moduleRef.get(AdminFactory)
    jwtService = moduleRef.get(JwtService)
    courierFactory = moduleRef.get(CourierFactory)

    await app.init()
  })

  test('[PUT] /couriers/:id', async () => {
    const admin = await adminFactory.makePrismaAdmin()

    const acessToken = jwtService.sign({ sub: admin.id.toString() })

    const courier = await courierFactory.makePrismaCourier()

    const courierId = courier.id.toString()

    const response = await request(app.getHttpServer())
      .put(`/couriers/${courierId}`)
      .set('Authorization', `Bearer ${acessToken}`)
      .send({
        email: 'johndoe@example.com',
      })

    expect(response.statusCode).toBe(204)

    const courierOnDatabase = await prisma.courier.findUnique({
      where: {
        email: 'johndoe@example.com',
      },
    })

    expect(courierOnDatabase).toBeTruthy()
  })
})
