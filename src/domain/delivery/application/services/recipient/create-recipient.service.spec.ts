import { CreateRecipientService } from './create-recipient.service'
import { InMemoryRecipientsRepository } from 'test/repositories/in-memory-recipients-repository'
import { RecipientAlreadyExistsError } from '@/core/errors/recipient-already-exists-error'

describe('Create recipient', () => {
  let inMemoryRecipientsRepository: InMemoryRecipientsRepository
  let sut: CreateRecipientService

  beforeEach(() => {
    inMemoryRecipientsRepository = new InMemoryRecipientsRepository()
    sut = new CreateRecipientService(inMemoryRecipientsRepository)
  })

  it('should be able to create a new courier account', async () => {
    const result = await sut.execute({
      name: 'John Doe',
      cpf: '11122233344',
      email: 'johndoe@example.com',
      state: 'São Paulo',
      city: 'São Paulo',
      zipCode: '11230000',
      streetAddress: 'Rua NodeJS, 67',
      neighborhood: 'Vila Nest',
      latitude: 0,
      longitude: 0,
    })

    expect(result.isRight()).toBe(true)
    expect(result.value).toEqual({ recipient: inMemoryRecipientsRepository.items[0] })
  })

  it('should not be able to create a new recipient with same CPF', async () => {
    await sut.execute({
      name: 'John Doe',
      cpf: '11122233344',
      email: 'johndoe@example.com',
      state: 'São Paulo',
      city: 'São Paulo',
      zipCode: '11230000',
      streetAddress: 'Rua NodeJS, 67',
      neighborhood: 'Vila Nest',
      latitude: 0,
      longitude: 0,
    })

    const result = await sut.execute({
      name: 'John Doe',
      cpf: '11122233344',
      email: 'johndoe@example.com',
      state: 'São Paulo',
      city: 'São Paulo',
      zipCode: '11230000',
      streetAddress: 'Rua NodeJS, 67',
      neighborhood: 'Vila Nest',
      latitude: 0,
      longitude: 0,
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(RecipientAlreadyExistsError)
  })
})
