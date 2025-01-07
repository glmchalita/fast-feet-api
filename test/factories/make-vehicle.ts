import { VehicleProps } from '@/domain/delivery/enterprise/value-objects/vehicle'
import { faker } from '@faker-js/faker'

export function makeVehicle(overwrite: Partial<VehicleProps> = {}) {
  const vehicle = {
    model: faker.vehicle.vehicle(),
    year: faker.string.numeric(4),
    licensePlate: faker.vehicle.vrm(),
    ...overwrite,
  }

  return vehicle
}
