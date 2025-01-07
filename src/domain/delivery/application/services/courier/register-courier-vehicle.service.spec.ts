import { InMemoryCouriersRepository } from 'test/repositories/in-memory-couriers-repository'
import { RegisterCourierVehicleService } from './register-courier-vehicle.service'
import { makeVehicle } from 'test/factories/make-vehicle'
import { makeCourier } from 'test/factories/make-courier'
import { VehicleAlreadyRegisteredError } from '@/core/errors/vehicle-already-registered-error'

describe('Register courier vehicle', () => {
  let inMemoryCouriersRepository: InMemoryCouriersRepository
  let sut: RegisterCourierVehicleService

  beforeEach(() => {
    inMemoryCouriersRepository = new InMemoryCouriersRepository()
    sut = new RegisterCourierVehicleService(inMemoryCouriersRepository)
  })

  it('should be able to register a courier vehicle', async () => {
    const courier = makeCourier()

    const courierId = courier.id.toString()

    await inMemoryCouriersRepository.create(courier)

    const vehicle = makeVehicle()

    const result = await sut.execute({ courierId, ...vehicle })

    expect(result.isRight()).toBe(true)
    expect(inMemoryCouriersRepository.items[0]).toEqual(
      expect.objectContaining({
        vehicle,
      }),
    )
  })

  it('should not be able to register a courier vehicle with same license plate', async () => {
    const courier1 = makeCourier()

    const courier1Id = courier1.id.toString()

    await inMemoryCouriersRepository.create(courier1)

    const vehicle = makeVehicle()

    await sut.execute({ courierId: courier1Id, ...vehicle })

    const courier2 = makeCourier()

    const courier2Id = courier2.id.toString()

    await inMemoryCouriersRepository.create(courier2)

    const result = await sut.execute({ courierId: courier2Id, ...vehicle })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(VehicleAlreadyRegisteredError)
  })
})
