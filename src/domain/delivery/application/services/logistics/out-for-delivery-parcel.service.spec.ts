import { InMemoryParcelsRepository } from 'test/repositories/in-memory-parcels-repository'
import { makeParcel } from 'test/factories/make-parcel'
import { InMemoryRecipientsRepository } from 'test/repositories/in-memory-recipients-repository'
import { Status } from '@/domain/delivery/enterprise/value-objects/status'
import { OutForDeliveryParcelService } from './out-for-delivery-parcel.service'

describe('Out for delivery parcel order', () => {
  let inMemoryRecipientsRepository: InMemoryRecipientsRepository
  let inMemoryParcelsRepository: InMemoryParcelsRepository
  let sut: OutForDeliveryParcelService

  beforeEach(() => {
    inMemoryRecipientsRepository = new InMemoryRecipientsRepository()
    inMemoryParcelsRepository = new InMemoryParcelsRepository(inMemoryRecipientsRepository)
    sut = new OutForDeliveryParcelService(inMemoryParcelsRepository)
  })

  it('should be able to mark out for delivery a parcel order', async () => {
    const parcel = makeParcel()

    parcel.markReadyForCollect()

    parcel.markCollected()

    const parcelId = parcel.id.toString()

    await inMemoryParcelsRepository.create(parcel)

    const result = await sut.execute({ parcelId })

    expect(result.isRight()).toBe(true)
    expect(inMemoryParcelsRepository.items[0].currentStatus).toEqual(Status.OUT_FOR_DELIVERY)
    expect(inMemoryParcelsRepository.items[0].statusHistory).toEqual([
      expect.objectContaining({ status: Status.ORDER_CREATED }),
      expect.objectContaining({ status: Status.READY_FOR_COLLECT }),
      expect.objectContaining({ status: Status.COLLECTED }),
      expect.objectContaining({ status: Status.OUT_FOR_DELIVERY }),
    ])
  })
})
