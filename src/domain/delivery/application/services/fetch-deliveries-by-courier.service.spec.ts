import { InMemoryCouriersRepository } from 'test/repositories/in-memory-couriers-repository'
import { InMemoryParcelsRepository } from 'test/repositories/in-memory-parcels-repository'
import { FetchDeliviriesByCourierService } from './fetch-deliveries-by-courier.service'
import { makeCourier } from 'test/factories/make-courier'
import { makeParcel } from 'test/factories/make-parcel'
import { assertRight } from '@/core/either'
import { InMemoryRecipientsRepository } from 'test/repositories/in-memory-recipients-repository'

describe('Fetch deliveries by courier', () => {
  let inMemoryRecipientsRepository: InMemoryRecipientsRepository
  let inMemoryParcelsRepository: InMemoryParcelsRepository
  let inMemoryCouriersRepository: InMemoryCouriersRepository
  let sut: FetchDeliviriesByCourierService

  beforeEach(() => {
    inMemoryRecipientsRepository = new InMemoryRecipientsRepository()
    inMemoryParcelsRepository = new InMemoryParcelsRepository(inMemoryRecipientsRepository)
    inMemoryCouriersRepository = new InMemoryCouriersRepository()
    sut = new FetchDeliviriesByCourierService(inMemoryParcelsRepository, inMemoryCouriersRepository)
  })

  it('should be able to fetch deliveries done by a courier', async () => {
    const courier = makeCourier()

    const courierId = courier.id.toString()

    await inMemoryCouriersRepository.create(courier)

    await inMemoryParcelsRepository.create(makeParcel({ courierId: courier.id }))
    await inMemoryParcelsRepository.create(makeParcel({ courierId: courier.id }))
    await inMemoryParcelsRepository.create(makeParcel({ courierId: courier.id }))

    const result = await sut.execute({ courierId, page: 1 })

    assertRight(result)

    expect(result.isRight()).toBe(true)
    expect(result.value.parcels).toEqual([
      expect.objectContaining({ courierId: courier.id }),
      expect.objectContaining({ courierId: courier.id }),
      expect.objectContaining({ courierId: courier.id }),
    ])
  })

  it('should be able to fetch paginated deliveries done by a courier', async () => {
    const courier = makeCourier()

    const courierId = courier.id.toString()

    await inMemoryCouriersRepository.create(courier)

    for (let i = 1; i <= 22; i++) {
      await inMemoryParcelsRepository.create(makeParcel({ courierId: courier.id }))
    }

    const result = await sut.execute({ courierId, page: 2 })

    assertRight(result)

    expect(result.isRight()).toBe(true)
    expect(result.value?.parcels).toHaveLength(2)
  })
})
