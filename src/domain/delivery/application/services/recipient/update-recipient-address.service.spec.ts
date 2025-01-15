import { InMemoryRecipientsRepository } from 'test/repositories/in-memory-recipients-repository'
import { UpdateRecipientAddressService } from './update-recipient-address.service'
import { makeRecipient } from 'test/factories/make-recipient'

describe('Update recipient address', () => {
  let inMemoryRecipientsRepository: InMemoryRecipientsRepository
  let sut: UpdateRecipientAddressService

  beforeEach(() => {
    inMemoryRecipientsRepository = new InMemoryRecipientsRepository()
    sut = new UpdateRecipientAddressService(inMemoryRecipientsRepository)
  })

  it('should be able to update a recipient address', async () => {
    const recipient = makeRecipient()

    const recipientId = recipient.id.toString()

    await inMemoryRecipientsRepository.create(recipient)

    const result = await sut.execute({
      recipientId,
      state: 'São Paulo',
      city: 'São Paulo',
      zipCode: '11230000',
      streetAddress: 'Rua NodeJS',
      neighborhood: 'Vila NestJS',
      latitude: 0,
      longitude: 0,
    })

    expect(result.isRight()).toBe(true)
    expect(inMemoryRecipientsRepository.items[0]).toEqual(
      expect.objectContaining({
        address: {
          state: 'São Paulo',
          city: 'São Paulo',
          zipCode: '11230000',
          streetAddress: 'Rua NodeJS',
          neighborhood: 'Vila NestJS',
          latitude: 0,
          longitude: 0,
        },
      }),
    )
  })
})
