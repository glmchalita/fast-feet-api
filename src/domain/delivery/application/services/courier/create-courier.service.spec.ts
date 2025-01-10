import { FakeHasher } from 'test/cryptography/fake-hasher'
import { InMemoryCouriersRepository } from 'test/repositories/in-memory-couriers-repository'
import { CreateCourierService } from './create-courier.service'
import { CourierAlreadyExistsError } from '@/core/errors/courier-already-exists-error'

describe('Create courier', () => {
  let inMemoryCouriersRepository: InMemoryCouriersRepository
  let fakeHasher: FakeHasher
  let sut: CreateCourierService

  beforeEach(() => {
    inMemoryCouriersRepository = new InMemoryCouriersRepository()
    fakeHasher = new FakeHasher()
    sut = new CreateCourierService(inMemoryCouriersRepository, fakeHasher)
  })

  it('should be able to create a new courier', async () => {
    const result = await sut.execute({
      name: 'John Doe',
      cpf: '11122233344',
      email: 'johndoe@example.com',
      password: '123456',
    })

    expect(result.isRight()).toBe(true)
    expect(result.value).toEqual({ courier: inMemoryCouriersRepository.items[0] })
  })

  it('should hash student password upon registration', async () => {
    const result = await sut.execute({
      name: 'John Doe',
      cpf: '11122233344',
      email: 'johndoe@example.com',
      password: '123456',
    })

    const hashedPassword = await fakeHasher.hash('123456')

    expect(result.isRight()).toBe(true)
    expect(inMemoryCouriersRepository.items[0].password).toEqual(hashedPassword)
  })

  it('should not be able to create a new courier with same CPF', async () => {
    await sut.execute({
      name: 'John Doe 1',
      cpf: '11122233344',
      email: 'johndoe1@example.com',
      password: '123456',
    })

    const result = await sut.execute({
      name: 'John Doe 2',
      cpf: '11122233344',
      email: 'johndoe2@example.com',
      password: '123456',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(CourierAlreadyExistsError)
  })

  it('should not be able to create a new courier with same E-mail', async () => {
    await sut.execute({
      name: 'John Doe 1',
      cpf: '11122233355',
      email: 'johndoe1@example.com',
      password: '123456',
    })

    const result = await sut.execute({
      name: 'John Doe 2',
      cpf: '11122233344',
      email: 'johndoe1@example.com',
      password: '123456',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(CourierAlreadyExistsError)
  })
})
