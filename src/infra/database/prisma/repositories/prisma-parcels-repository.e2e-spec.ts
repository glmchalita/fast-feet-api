import { ParcelsRepository } from '@/domain/delivery/application/repositories/parcels-repository'
import { AppModule } from '@/infra/app.module'
import { CacheRepository } from '@/infra/cache/cache-repository'
import { CacheModule } from '@/infra/cache/cache.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import { FactoriesModule } from 'test/factories/factories.module'
import { CourierFactory } from 'test/factories/make-courier'
import { ParcelFactory } from 'test/factories/make-parcel'
import { RecipientFactory } from 'test/factories/make-recipient'

describe('Prisma Parcels Repository (E2E)', () => {
  let app: INestApplication
  let courierFactory: CourierFactory
  let recipientFactory: RecipientFactory
  let parcelFactory: ParcelFactory
  let cacheRepository: CacheRepository
  let parcelsRepository: ParcelsRepository

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule, CacheModule, FactoriesModule],
      providers: [],
    }).compile()

    app = moduleRef.createNestApplication()

    courierFactory = moduleRef.get(CourierFactory)
    recipientFactory = moduleRef.get(RecipientFactory)
    parcelFactory = moduleRef.get(ParcelFactory)
    cacheRepository = moduleRef.get(CacheRepository)
    parcelsRepository = moduleRef.get(ParcelsRepository)

    await app.init()
  })

  it('should cache parcels deliveried by courier', async () => {
    const courier = await courierFactory.makePrismaCourier()

    const courierId = courier.id.toString()

    const recipient = await recipientFactory.makePrismaRecipient()

    await Promise.all([
      parcelFactory.makePrismaParcel({
        courierId: courier.id,
        recipientId: recipient.id,
      }),
      parcelFactory.makePrismaParcel({
        courierId: courier.id,
        recipientId: recipient.id,
      }),
      parcelFactory.makePrismaParcel({
        courierId: courier.id,
        recipientId: recipient.id,
      }),
    ])

    const parcelsByCourier = await parcelsRepository.findManyByCourierIdWithRecipient(courierId, {
      page: 1,
    })

    const cached = await cacheRepository.get(`parcels:${courierId}:deliveries`)

    if (!cached) throw new Error()

    expect(JSON.parse(cached)).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: parcelsByCourier[0].parcelId.toString(),
        }),
      ]),
    )
  })

  it('should return cached parcels deliveried by courier on subsequent calls', async () => {
    const courier = await courierFactory.makePrismaCourier()

    const courierId = courier.id.toString()

    const recipient = await recipientFactory.makePrismaRecipient()

    await Promise.all([
      parcelFactory.makePrismaParcel({
        courierId: courier.id,
        recipientId: recipient.id,
      }),
      parcelFactory.makePrismaParcel({
        courierId: courier.id,
        recipientId: recipient.id,
      }),
      parcelFactory.makePrismaParcel({
        courierId: courier.id,
        recipientId: recipient.id,
      }),
    ])

    let cached = await cacheRepository.get(`parcels:${courierId}:deliveries`)

    expect(cached).toBeNull()

    await parcelsRepository.findManyByCourierIdWithRecipient(courierId, {
      page: 1,
    })

    cached = await cacheRepository.get(`parcels:${courierId}:deliveries`)

    expect(cached).not.toBeNull()

    const parcelsByCourier = await parcelsRepository.findManyByCourierIdWithRecipient(courierId, {
      page: 1,
    })

    if (!cached) throw new Error()

    expect(JSON.parse(cached)).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: parcelsByCourier[0].parcelId.toString(),
        }),
      ]),
    )
  })

  it('should reset parcels deliveries by courier cache when saving the parcel', async () => {
    const courier = await courierFactory.makePrismaCourier()

    const courierId = courier.id.toString()

    const recipient = await recipientFactory.makePrismaRecipient()

    const parcel = await parcelFactory.makePrismaParcel({
      courierId: courier.id,
      recipientId: recipient.id,
    })

    await cacheRepository.set(`parcels:${courierId}:deliveries`, JSON.stringify({ empty: true }))

    await parcelsRepository.save(parcel)

    const cached = await cacheRepository.get(`parcels:${courierId}:deliveries`)

    expect(cached).toBeNull()
  })
})
