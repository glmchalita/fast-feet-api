import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { CourierFactory } from 'test/factories/make-courier'

describe('Delete courier (E2E)', () => {
  let app: INestApplication
  let prisma: PrismaService
  let courierFactory: CourierFactory

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [CourierFactory],
    }).compile()

    app = moduleRef.createNestApplication()
    prisma = moduleRef.get(PrismaService)
    courierFactory = moduleRef.get(CourierFactory)

    await app.init()
  })

  test('[DELETE] /couriers/:id', async () => {
    const courier = await courierFactory.makePrismaCourier()

    const courierId = courier.id.toString()

    const response = await request(app.getHttpServer()).delete(`/couriers/${courierId}`)

    expect(response.statusCode).toBe(204)

    const courierOnDatabase = await prisma.courier.findUnique({
      where: {
        id: courierId,
      },
    })

    expect(courierOnDatabase).toBeNull()
  })
})
