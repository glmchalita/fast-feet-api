import { InMemoryRecipientsRepository } from 'test/repositories/in-memory-recipients-repository'
import { DeleteRecipientService } from './delete-recipient'
import { makeRecipient } from 'test/factories/make-recipient'

describe('Delete recipient', () => {
  let inMemoryRecipientsRepository: InMemoryRecipientsRepository
  let sut: DeleteRecipientService

  beforeEach(() => {
    inMemoryRecipientsRepository = new InMemoryRecipientsRepository()
    sut = new DeleteRecipientService(inMemoryRecipientsRepository)
  })

  it('should be able to delete a recipient', async () => {
    const recipient = makeRecipient()

    const recipientId = recipient.id.toString()

    await inMemoryRecipientsRepository.create(recipient)

    const result = await sut.execute({ recipientId })

    expect(result.isRight()).toBe(true)
    expect(inMemoryRecipientsRepository.items).toHaveLength(0)
  })
})
