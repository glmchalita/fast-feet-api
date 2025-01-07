import { FakeHasher } from 'test/cryptography/fake-hasher'
import { InMemoryCouriersRepository } from 'test/repositories/in-memory-couriers-repository'
import { makeCourier } from 'test/factories/make-courier'
import { UpdateCourierCredentialsService } from './update-courier-credentials.service'

describe('Update courier credentials', () => {
  let inMemoryCouriersRepository: InMemoryCouriersRepository
  let fakeHasher: FakeHasher
  let sut: UpdateCourierCredentialsService

  beforeEach(() => {
    inMemoryCouriersRepository = new InMemoryCouriersRepository()
    fakeHasher = new FakeHasher()
    sut = new UpdateCourierCredentialsService(inMemoryCouriersRepository, fakeHasher)
  })

  it('should be able to update a courier email and password', async () => {
    const courier = makeCourier()

    const courierId = courier.id.toString()

    await inMemoryCouriersRepository.create(courier)

    const result = await sut.execute({
      courierId,
      email: 'johndoe@example.com',
      password: '123456',
    })

    const newHashedPassword = await fakeHasher.hash('123456')

    expect(result.isRight()).toBe(true)
    expect(inMemoryCouriersRepository.items[0]).toEqual(
      expect.objectContaining({
        email: 'johndoe@example.com',
        password: newHashedPassword,
      }),
    )
  })

  it('should be able to update only courier email', async () => {
    const courier = makeCourier()

    const courierId = courier.id.toString()

    await inMemoryCouriersRepository.create(courier)

    const result = await sut.execute({
      courierId,
      email: 'johndoe@example.com',
    })

    expect(result.isRight()).toBe(true)
    expect(inMemoryCouriersRepository.items[0]).toEqual(
      expect.objectContaining({
        email: 'johndoe@example.com',
        password: courier.password,
      }),
    )
  })

  it('should be able to update only courier password', async () => {
    const courier = makeCourier()

    const courierId = courier.id.toString()

    await inMemoryCouriersRepository.create(courier)

    const result = await sut.execute({
      courierId,
      password: '123456',
    })

    const newHashedPassword = await fakeHasher.hash('123456')

    expect(result.isRight()).toBe(true)
    expect(inMemoryCouriersRepository.items[0]).toEqual(
      expect.objectContaining({
        email: courier.email,
        password: newHashedPassword,
      }),
    )
  })
})
