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

describe('Fetch nearby deliveries (E2E)', () => {
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

  test('[GET] /parcels/nearby', async () => {
    const courier = await courierFactory.makePrismaCourier({
      name: 'John Doe',
    })

    const accessToken = jwtService.sign({ sub: courier.id.toString() })

    const nearestRecipient1 = await recipientFactory.makePrismaRecipient({
      address: { latitude: -23.5500029, longitude: -46.5476748 },
    })

    const nearestRecipient2 = await recipientFactory.makePrismaRecipient({
      address: { latitude: -23.5509319, longitude: -46.5395832 },
    })

    const farthestRecipient = await recipientFactory.makePrismaRecipient({
      address: { latitude: -23.2883361, longitude: -47.2054327 },
    })

    const nearestParcel1 = await parcelFactory.makePrismaParcel({
      recipientId: nearestRecipient1.id,
      courierId: courier.id,
    })

    const nearestParcel2 = await parcelFactory.makePrismaParcel({
      recipientId: nearestRecipient2.id,
      courierId: courier.id,
    })

    await parcelFactory.makePrismaParcel({
      recipientId: farthestRecipient.id,
      courierId: courier.id,
    })

    const response = await request(app.getHttpServer())
      .get(`/parcels/nearby`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({ latitude: -23.5494598, longitude: -46.5416041 })

    expect(response.statusCode).toBe(200)
    expect(response.body.parcels).toHaveLength(2)
    expect(response.body).toEqual({
      parcels: expect.arrayContaining([
        expect.objectContaining({
          id: nearestParcel1.id.toString(),
          recipient_id: nearestRecipient1.id.toString(),
        }),
        expect.objectContaining({
          id: nearestParcel2.id.toString(),
          recipient_id: nearestRecipient2.id.toString(),
        }),
      ]),
    })
  })
})
