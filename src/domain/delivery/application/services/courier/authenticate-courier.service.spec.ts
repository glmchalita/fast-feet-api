import { InMemoryCouriersRepository } from 'test/repositories/in-memory-couriers-repository'
import { FakeHasher } from 'test/cryptography/fake-hasher'
import { FakeEncrypter } from 'test/cryptography/fake-encrypter'
import { makeCourier } from 'test/factories/make-courier'
import { AuthenticateCourierService } from './authenticate-courier.service'

describe('Authenticate courier', () => {
  let inMemoryCouriersRepository: InMemoryCouriersRepository
  let fakeHasher: FakeHasher
  let fakeEncrypter: FakeEncrypter
  let sut: AuthenticateCourierService

  beforeEach(() => {
    inMemoryCouriersRepository = new InMemoryCouriersRepository()
    fakeHasher = new FakeHasher()
    fakeEncrypter = new FakeEncrypter()
    sut = new AuthenticateCourierService(inMemoryCouriersRepository, fakeHasher, fakeEncrypter)
  })

  it('should be able to authenticate a courier', async () => {
    const courier = makeCourier({
      cpf: '11122233344',
      password: await fakeHasher.hash('123456'),
    })

    await inMemoryCouriersRepository.create(courier)

    const result = await sut.execute({
      cpf: '11122233344',
      password: '123456',
    })

    expect(result.isRight()).toBe(true)
    expect(result.value).toEqual({
      accessToken: expect.any(String),
    })
  })
})
