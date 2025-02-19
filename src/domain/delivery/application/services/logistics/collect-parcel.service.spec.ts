import { InMemoryParcelsRepository } from 'test/repositories/in-memory-parcels-repository'
import { InMemoryCouriersRepository } from 'test/repositories/in-memory-couriers-repository'
import { makeParcel } from 'test/factories/make-parcel'
import { makeCourier } from 'test/factories/make-courier'
import { InMemoryRecipientsRepository } from 'test/repositories/in-memory-recipients-repository'
import { CollectParcelService } from './collect-parcel.service'
import { Status } from '@/domain/delivery/enterprise/value-objects/status'
import { InMemoryParcelAttachmentRepository } from 'test/repositories/in-memory-parcel-attachment-repository'

describe('Collect parcel order', () => {
  let inMemoryRecipientsRepository: InMemoryRecipientsRepository
  let inMemoryParcelAttachmentRepository: InMemoryParcelAttachmentRepository
  let inMemoryParcelsRepository: InMemoryParcelsRepository
  let inMemoryCouriersRepository: InMemoryCouriersRepository
  let sut: CollectParcelService

  beforeEach(() => {
    inMemoryRecipientsRepository = new InMemoryRecipientsRepository()
    inMemoryParcelAttachmentRepository = new InMemoryParcelAttachmentRepository()
    inMemoryParcelsRepository = new InMemoryParcelsRepository(
      inMemoryRecipientsRepository,
      inMemoryParcelAttachmentRepository,
    )
    inMemoryCouriersRepository = new InMemoryCouriersRepository()
    sut = new CollectParcelService(inMemoryParcelsRepository, inMemoryCouriersRepository)
  })

  it('should allow a courier to collect a parcel order', async () => {
    const parcel = makeParcel()

    parcel.markReadyForCollect()

    const parcelId = parcel.id.toString()

    await inMemoryParcelsRepository.create(parcel)

    const courier = makeCourier()

    const courierId = courier.id.toString()

    await inMemoryCouriersRepository.create(courier)

    const result = await sut.execute({ parcelId, courierId })

    expect(result.isRight()).toBe(true)
    expect(inMemoryParcelsRepository.items[0].currentStatus).toEqual(Status.COLLECTED)
    expect(inMemoryParcelsRepository.items[0].courierId).toEqual(courier.id)
    expect(inMemoryParcelsRepository.items[0].statusHistory).toEqual([
      expect.objectContaining({ status: Status.ORDER_CREATED }),
      expect.objectContaining({ status: Status.READY_FOR_COLLECT }),
      expect.objectContaining({ status: Status.COLLECTED }),
    ])
  })
})
