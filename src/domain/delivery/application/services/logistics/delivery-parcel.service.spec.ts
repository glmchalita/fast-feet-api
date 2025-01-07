import { InMemoryParcelsRepository } from 'test/repositories/in-memory-parcels-repository'
import { makeParcel } from 'test/factories/make-parcel'
import { InMemoryRecipientsRepository } from 'test/repositories/in-memory-recipients-repository'
import { DeliveryParcelService } from './delivery-parcel.service'
import { Status } from '@/domain/delivery/enterprise/value-objects/status'
import { makeParcelAttachment } from 'test/factories/make-parcel-attachment'

describe('Delivery parcel order', () => {
  let inMemoryRecipientsRepository: InMemoryRecipientsRepository
  let inMemoryParcelsRepository: InMemoryParcelsRepository
  let sut: DeliveryParcelService

  beforeEach(() => {
    inMemoryRecipientsRepository = new InMemoryRecipientsRepository()
    inMemoryParcelsRepository = new InMemoryParcelsRepository(inMemoryRecipientsRepository)
    sut = new DeliveryParcelService(inMemoryParcelsRepository)
  })

  it('should be able to mark delivered a parcel order', async () => {
    const parcel = makeParcel()

    parcel.markReadyForCollect()

    parcel.markCollected()

    parcel.markOutForDelivery()

    const parcelId = parcel.id.toString()

    await inMemoryParcelsRepository.create(parcel)

    const attachment = makeParcelAttachment()

    const attachmentId = attachment.id.toString()

    const result = await sut.execute({ parcelId, attachmentId })

    expect(result.isRight()).toBe(true)
    expect(inMemoryParcelsRepository.items[0].currentStatus).toEqual(Status.DELIVERED)
    expect(inMemoryParcelsRepository.items[0].statusHistory).toEqual([
      expect.objectContaining({ status: Status.ORDER_CREATED }),
      expect.objectContaining({ status: Status.READY_FOR_COLLECT }),
      expect.objectContaining({ status: Status.COLLECTED }),
      expect.objectContaining({ status: Status.OUT_FOR_DELIVERY }),
      expect.objectContaining({ status: Status.DELIVERED }),
    ])
  })
})
