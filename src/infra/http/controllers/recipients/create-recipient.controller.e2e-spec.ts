import { AppModule } from '@/infra/app.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import request from 'supertest'

describe('Create recipient (E2E)', () => {
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

  test('[POST] /recipients', async () => {
    const response = await request(app.getHttpServer()).post('/recipients').send({
      name: 'John Doe',
      cpf: '11122233344',
      email: 'johndoe@example.com',
      state: 'São Paulo',
      city: 'São Paulo',
      zipCode: '03929000',
      streetAddress: 'Rua Joaquim Silva Nesto 82',
      neighborhood: 'Vila Script',
      latitude: -27.2092052,
      longitude: -49.6401091,
    })

    expect(response.statusCode).toBe(201)

    const recipientOnDatabase = await prisma.recipient.findUnique({
      where: { email: 'johndoe@example.com' },
    })

    expect(recipientOnDatabase).toBeTruthy()
  })
})
