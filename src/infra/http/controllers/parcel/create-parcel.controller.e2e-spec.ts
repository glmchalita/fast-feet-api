import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { AdminFactory } from 'test/factories/make-admin'
import { RecipientFactory } from 'test/factories/make-recipient'

describe('Create parcel (E2E)', () => {
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

  test('[POST] /parcels', async () => {
    const admin = await adminFactory.makePrismaAdmin()

    const accessToken = jwtService.sign({ sub: admin.id.toString() })

    const recipient = await recipientFactory.makePrismaRecipient()

    const recipientId = recipient.id.toString()

    const response = await request(app.getHttpServer())
      .post('/parcels')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({ recipientId })

    expect(response.statusCode).toBe(201)

    const parcelOnDatabase = await prisma.parcel.findFirst({
      where: { recipientId },
    })

    expect(parcelOnDatabase).toBeTruthy()

    const statusHistory = await prisma.statusHistory.findFirst({
      where: {
        parcel: {
          recipientId,
        },
      },
      include: {
        parcel: true,
      },
    })

    expect(statusHistory).toEqual(
      expect.objectContaining({
        status: 'ORDER_CREATED',
        parcel: expect.objectContaining({
          recipientId,
        }),
      }),
    )
  })
})
