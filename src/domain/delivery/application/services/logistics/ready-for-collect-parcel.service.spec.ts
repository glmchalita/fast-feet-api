import { InMemoryParcelsRepository } from 'test/repositories/in-memory-parcels-repository'
import { makeParcel } from 'test/factories/make-parcel'
import { InMemoryRecipientsRepository } from 'test/repositories/in-memory-recipients-repository'
import { Status } from '@/domain/delivery/enterprise/value-objects/status'
import { ReadyForCollectParcelService } from './ready-for-collect-parcel.service'
import { InMemoryParcelAttachmentRepository } from 'test/repositories/in-memory-parcel-attachment-repository'

describe('Ready for collect parcel order', () => {
  let inMemoryRecipientsRepository: InMemoryRecipientsRepository
  let inMemoryParcelAttachmentRepository: InMemoryParcelAttachmentRepository
  let inMemoryParcelsRepository: InMemoryParcelsRepository
  let sut: ReadyForCollectParcelService

  beforeEach(() => {
    inMemoryRecipientsRepository = new InMemoryRecipientsRepository()
    inMemoryParcelAttachmentRepository = new InMemoryParcelAttachmentRepository()
    inMemoryParcelsRepository = new InMemoryParcelsRepository(
      inMemoryRecipientsRepository,
      inMemoryParcelAttachmentRepository,
    )
    sut = new ReadyForCollectParcelService(inMemoryParcelsRepository)
  })

  it('should be able to mark ready for collect a parcel order', async () => {
    const parcel = makeParcel()

    const parcelId = parcel.id.toString()

    await inMemoryParcelsRepository.create(parcel)

    const result = await sut.execute({ parcelId })

    expect(result.isRight()).toBe(true)
    expect(inMemoryParcelsRepository.items[0].currentStatus).toEqual(Status.READY_FOR_COLLECT)
    expect(inMemoryParcelsRepository.items[0].statusHistory).toEqual([
      expect.objectContaining({ status: Status.ORDER_CREATED }),
      expect.objectContaining({ status: Status.READY_FOR_COLLECT }),
    ])
  })
})
