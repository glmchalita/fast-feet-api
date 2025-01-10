import { FakeEncrypter } from 'test/cryptography/fake-encrypter'
import { AuthenticateAdminService } from './authenticate-admin.service'
import { InMemoryAdminsRepository } from 'test/repositories/in-memory-admins-repository'
import { makeAdmin } from 'test/factories/make-admin'

describe('Authenticate admin', () => {
  let inMemoryAdminsRepository: InMemoryAdminsRepository
  let fakeEncrypter: FakeEncrypter
  let sut: AuthenticateAdminService

  beforeEach(() => {
    inMemoryAdminsRepository = new InMemoryAdminsRepository()
    fakeEncrypter = new FakeEncrypter()
    sut = new AuthenticateAdminService(inMemoryAdminsRepository, fakeEncrypter)
  })

  it('should be able to authenticate a courier', async () => {
    const admin = makeAdmin({
      email: 'johndoe@example.com',
      password: '123456',
    })

    await inMemoryAdminsRepository.items.push(admin)

    const result = await sut.execute({
      email: 'johndoe@example.com',
      password: '123456',
    })

    expect(result.isRight()).toBe(true)
    expect(result.value).toEqual({
      accessToken: expect.any(String),
    })
  })
})
