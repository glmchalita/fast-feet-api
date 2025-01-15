import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { AdminFactory } from 'test/factories/make-admin'

describe('Create courier (E2E)', () => {
  let app: INestApplication
  let prisma: PrismaService
  let adminFactory: AdminFactory
  let jwtService: JwtService

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [AdminFactory, JwtService],
    }).compile()

    app = moduleRef.createNestApplication()

    prisma = moduleRef.get(PrismaService)
    adminFactory = moduleRef.get(AdminFactory)
    jwtService = moduleRef.get(JwtService)

    await app.init()
  })

  test('[POST] /couriers', async () => {
    const admin = await adminFactory.makePrismaAdmin()

    const acessToken = jwtService.sign({ sub: admin.id.toString() })

    const response = await request(app.getHttpServer())
      .post('/couriers')
      .set('Authorization', `Bearer ${acessToken}`)
      .send({
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
