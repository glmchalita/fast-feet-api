import { InMemoryCouriersRepository } from 'test/repositories/in-memory-couriers-repository'
import { DeleteCourierService } from './delete-courier.service'
import { makeCourier } from 'test/factories/make-courier'

describe('Delete courier', () => {
  let inMemoryCouriersRepository: InMemoryCouriersRepository
  let sut: DeleteCourierService

  beforeEach(() => {
    inMemoryCouriersRepository = new InMemoryCouriersRepository()
    sut = new DeleteCourierService(inMemoryCouriersRepository)
  })

  it('should be able to delete a courier', async () => {
    const courier = makeCourier()

    const courierId = courier.id.toString()

    await inMemoryCouriersRepository.create(courier)

    const result = await sut.execute({ courierId })

    expect(result.isRight()).toBe(true)
    expect(inMemoryCouriersRepository.items).toHaveLength(0)
  })
})
