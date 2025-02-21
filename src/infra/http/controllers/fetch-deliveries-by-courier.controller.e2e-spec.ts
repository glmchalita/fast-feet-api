import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { FactoriesModule } from 'test/factories/factories.module'
import { CourierFactory } from 'test/factories/make-courier'
import { ParcelFactory } from 'test/factories/make-parcel'
import { RecipientFactory } from 'test/factories/make-recipient'

describe('Fetch deliveries by courier (E2E)', () => {
  let app: INestApplication
  let courierFactory: CourierFactory
  let recipientFactory: RecipientFactory
  let parcelFactory: ParcelFactory
  let jwtService: JwtService

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule, FactoriesModule],
      providers: [JwtService],
    }).compile()

    app = moduleRef.createNestApplication()

    courierFactory = moduleRef.get(CourierFactory)
    recipientFactory = moduleRef.get(RecipientFactory)
    parcelFactory = moduleRef.get(ParcelFactory)
    jwtService = moduleRef.get(JwtService)

    await app.init()
  })

  test('[GET] /couriers/:id/deliveries', async () => {
    const courier = await courierFactory.makePrismaCourier({
      name: 'John Doe',
    })

    const courierId = courier.id.toString()

    const accessToken = jwtService.sign({ sub: courier.id.toString() })

    const recipient = await recipientFactory.makePrismaRecipient({ name: 'John Doe' })

    await Promise.all([
      parcelFactory.makePrismaParcel({
        recipientId: recipient.id,
        courierId: courier.id,
      }),
      parcelFactory.makePrismaParcel({
        recipientId: recipient.id,
        courierId: courier.id,
      }),
      parcelFactory.makePrismaParcel({
        recipientId: recipient.id,
        courierId: courier.id,
      }),
      parcelFactory.makePrismaParcel({
        recipientId: recipient.id,
        courierId: courier.id,
      }),
    ])

    const response = await request(app.getHttpServer())
      .get(`/couriers/${courierId}/deliveries`)
      .set('Authorization', `Bearer ${accessToken}`)

    expect(response.statusCode).toBe(200)
    expect(response.body.parcels).toHaveLength(4)
    expect(response.body).toEqual({
      parcels: expect.arrayContaining([
        expect.objectContaining({ courierId, recipientName: 'John Doe' }),
        expect.objectContaining({ courierId, recipientName: 'John Doe' }),
        expect.objectContaining({ courierId, recipientName: 'John Doe' }),
        expect.objectContaining({ courierId, recipientName: 'John Doe' }),
      ]),
    })
  })
})
