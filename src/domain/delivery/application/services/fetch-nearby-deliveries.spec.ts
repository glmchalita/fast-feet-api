import { InMemoryParcelsRepository } from 'test/repositories/in-memory-parcels-repository'
import { makeParcel } from 'test/factories/make-parcel'
import { assertRight } from '@/core/either'
import { FetchNearbyDeliveriesService } from './fetch-nearby-deliveries'
import { makeRecipient } from 'test/factories/make-recipient'
import { InMemoryRecipientsRepository } from 'test/repositories/in-memory-recipients-repository'

describe('Fetch nearby deliveries', () => {
  let inMemoryRecipientsRepository: InMemoryRecipientsRepository
  let inMemoryParcelsRepository: InMemoryParcelsRepository
  let sut: FetchNearbyDeliveriesService

  beforeEach(() => {
    inMemoryRecipientsRepository = new InMemoryRecipientsRepository()
    inMemoryParcelsRepository = new InMemoryParcelsRepository(inMemoryRecipientsRepository)
    sut = new FetchNearbyDeliveriesService(inMemoryParcelsRepository)
  })

  it('should be able to search for deliveries nearby to courier', async () => {
    const nearbyRecipient = makeRecipient({
      address: {
        latitude: -23.5500515,
        longitude: -46.5451065,
      },
    })

    const farawayRecipient = makeRecipient({
      address: {
        latitude: 5.8072234,
        longitude: -71.142311,
      },
    })

    await inMemoryRecipientsRepository.create(nearbyRecipient)
    await inMemoryRecipientsRepository.create(farawayRecipient)

    await inMemoryParcelsRepository.create(makeParcel({ recipientId: nearbyRecipient.id }))
    await inMemoryParcelsRepository.create(makeParcel({ recipientId: nearbyRecipient.id }))
    await inMemoryParcelsRepository.create(makeParcel({ recipientId: farawayRecipient.id }))

    const result = await sut.execute({
      courierLatitude: -23.5608107,
      courierLongitude: -46.5435805,
      page: 1,
    })

    assertRight(result)

    expect(result.isRight()).toBe(true)
    expect(result.value.parcels).toHaveLength(2)
  })

  it('should be able to fetch paginated deliveries nearby to courier', async () => {
    const nearbyRecipient = makeRecipient({
      address: {
        latitude: -23.5500515,
        longitude: -46.5451065,
      },
    })

    const farawayRecipient = makeRecipient({
      address: {
        latitude: 5.8072234,
        longitude: -71.142311,
      },
    })

    await inMemoryRecipientsRepository.create(nearbyRecipient)
    await inMemoryRecipientsRepository.create(farawayRecipient)

    for (let i = 1; i <= 22; i++) {
      await inMemoryParcelsRepository.create(makeParcel({ recipientId: nearbyRecipient.id }))
    }

    await inMemoryParcelsRepository.create(makeParcel({ recipientId: farawayRecipient.id }))
    const result = await sut.execute({
      courierLatitude: -23.5608107,
      courierLongitude: -46.5435805,
      page: 2,
    })

    assertRight(result)

    expect(result.isRight()).toBe(true)
    expect(result.value?.parcels).toHaveLength(2)
  })
})
