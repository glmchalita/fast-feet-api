import { InMemoryParcelsRepository } from 'test/repositories/in-memory-parcels-repository'
import { DeleteParcelService } from './delete-parcel.service'
import { makeParcel } from 'test/factories/make-parcel'
import { InMemoryRecipientsRepository } from 'test/repositories/in-memory-recipients-repository'
import { InMemoryParcelAttachmentRepository } from 'test/repositories/in-memory-parcel-attachment-repository'

describe('Delete parcel', () => {
  let inMemoryRecipientsRepository: InMemoryRecipientsRepository
  let inMemoryParcelAttachmentRepository: InMemoryParcelAttachmentRepository
  let inMemoryParcelsRepository: InMemoryParcelsRepository
  let sut: DeleteParcelService

  beforeEach(() => {
    inMemoryRecipientsRepository = new InMemoryRecipientsRepository()
    inMemoryParcelAttachmentRepository = new InMemoryParcelAttachmentRepository()
    inMemoryParcelsRepository = new InMemoryParcelsRepository(
      inMemoryRecipientsRepository,
      inMemoryParcelAttachmentRepository,
    )
    sut = new DeleteParcelService(inMemoryParcelsRepository)
  })

  it('should be able to delete a parcel', async () => {
    const parcel = makeParcel()

    const parcelId = parcel.id.toString()

    await inMemoryParcelsRepository.create(parcel)

    const result = await sut.execute({ parcelId })

    expect(result.isRight()).toBe(true)
    expect(inMemoryParcelsRepository.items).toHaveLength(0)
  })
})
