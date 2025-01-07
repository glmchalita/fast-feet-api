import { Either, left, right } from '@/core/either'
import { Injectable } from '@nestjs/common'
import { CouriersRepository } from '../../repositories/couriers-repository'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'
import { VehicleAlreadyRegisteredError } from '@/core/errors/vehicle-already-registered-error'
import { Vehicle } from '@/domain/delivery/enterprise/value-objects/vehicle'

interface RegisterCourierVehicleServiceRequest {
  courierId: string
  model: string
  year: string
  licensePlate: string
}

type RegisterCourierVehicleServiceResponse = Either<
  ResourceNotFoundError | VehicleAlreadyRegisteredError,
  null
>

@Injectable()
export class RegisterCourierVehicleService {
  constructor(private couriersRepository: CouriersRepository) {}

  async execute({
    courierId,
    model,
    year,
    licensePlate,
  }: RegisterCourierVehicleServiceRequest): Promise<RegisterCourierVehicleServiceResponse> {
    const courier = await this.couriersRepository.findById(courierId)

    if (!courier) return left(new ResourceNotFoundError())

    const vehicleAlreadyRegistered =
      await this.couriersRepository.findByVehicleLicensePlate(licensePlate)

    if (vehicleAlreadyRegistered) return left(new VehicleAlreadyRegisteredError(licensePlate))

    const vehicle = Vehicle.create({ model, year, licensePlate })

    courier.vehicle = vehicle

    await this.couriersRepository.save(courier)

    return right(null)
  }
}
