import { AppModule } from '@/infra/app.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import request from 'supertest'

describe('Create courier (E2E)', () => {
  let app: INestApplication
  let prisma: PrismaService

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile()

    app = moduleRef.createNestApplication()

    prisma = moduleRef.get(PrismaService)

    await app.init()
  })

  test('[POST] /couriers', async () => {
    const response = await request(app.getHttpServer()).post('/couriers').send({
      name: 'John Doe',
      cpf: '11122233344',
      email: 'johndoe@example.com',
      password: '123456',
    })

    expect(response.statusCode).toBe(201)

    const courierOnDatabase = await prisma.courier.findUnique({
      where: { email: 'johndoe@example.com' },
    })

    expect(courierOnDatabase).toBeTruthy()
  })
})
