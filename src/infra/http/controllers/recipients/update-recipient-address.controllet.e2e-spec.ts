import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import { Decimal } from '@prisma/client/runtime/library'
import request from 'supertest'
import { AdminFactory } from 'test/factories/make-admin'
import { RecipientFactory } from 'test/factories/make-recipient'

describe('Update recipient address (E2E)', () => {
  let app: INestApplication
  let prisma: PrismaService
  let adminFactory: AdminFactory
  let jwtService: JwtService
  let recipientFactory: RecipientFactory

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [AdminFactory, JwtService, RecipientFactory],
    }).compile()

    app = moduleRef.createNestApplication()

    prisma = moduleRef.get(PrismaService)
    adminFactory = moduleRef.get(AdminFactory)
    jwtService = moduleRef.get(JwtService)
    recipientFactory = moduleRef.get(RecipientFactory)

    await app.init()
  })

  test('[PUT] /recipients/:id', async () => {
    const admin = await adminFactory.makePrismaAdmin()

    const accessToken = jwtService.sign({ sub: admin.id.toString() })

    const recipient = await recipientFactory.makePrismaRecipient()

    const recipientId = recipient.id.toString()

    const response = await request(app.getHttpServer())
      .put(`/recipients/${recipientId}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        state: 'São Paulo',
        city: 'São Paulo',
        zipCode: '01134000',
        streetAddress: 'Rua TypeScript 204',
        neighborhood: 'Vila NestJS',
        latitude: -23.638738,
        longitude: -46.6952605,
      })

    expect(response.statusCode).toBe(204)

    const recipientOnDatabase = await prisma.recipient.findUnique({
      where: {
        id: recipientId,
      },
    })

    expect(recipientOnDatabase).toBeTruthy()
    expect(recipientOnDatabase).toEqual(
      expect.objectContaining({
        state: 'São Paulo',
        city: 'São Paulo',
        zipCode: '01134000',
        streetAddress: 'Rua TypeScript 204',
        neighborhood: 'Vila NestJS',
        latitude: new Decimal(-23.638738),
        longitude: new Decimal(-46.6952605),
      }),
    )
  })
})
