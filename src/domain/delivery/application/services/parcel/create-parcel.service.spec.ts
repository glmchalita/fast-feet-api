import { InMemoryParcelsRepository } from 'test/repositories/in-memory-parcels-repository'
import { CreateParcelService } from './create-parcel.service'
import { makeRecipient } from 'test/factories/make-recipient'
import { InMemoryRecipientsRepository } from 'test/repositories/in-memory-recipients-repository'
import { InMemoryParcelAttachmentRepository } from 'test/repositories/in-memory-parcel-attachment-repository'

describe('Create parcel', () => {
  let inMemoryRecipientsRepository: InMemoryRecipientsRepository
  let inMemoryParcelAttachmentRepository: InMemoryParcelAttachmentRepository
  let inMemoryParcelsRepository: InMemoryParcelsRepository
  let sut: CreateParcelService

  beforeEach(() => {
    inMemoryRecipientsRepository = new InMemoryRecipientsRepository()
    inMemoryParcelAttachmentRepository = new InMemoryParcelAttachmentRepository()
    inMemoryParcelsRepository = new InMemoryParcelsRepository(
      inMemoryRecipientsRepository,
      inMemoryParcelAttachmentRepository,
    )
    sut = new CreateParcelService(inMemoryParcelsRepository, inMemoryRecipientsRepository)
  })

  it('should be able to create a new parcel', async () => {
    const recipient = makeRecipient({ name: 'John Doe' })

    const recipientId = recipient.id.toString()

    await inMemoryRecipientsRepository.create(recipient)

    const result = await sut.execute({ recipientId })

    expect(result.isRight()).toBe(true)
    expect(result.value).toEqual({ parcel: inMemoryParcelsRepository.items[0] })
  })
})
