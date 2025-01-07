import { Courier, CourierProps } from '@/domain/delivery/enterprise/entities/courier'
import { faker } from '@faker-js/faker'

export function makeCourier(overwrite: Partial<CourierProps> = {}) {
  const courier = Courier.create({
    name: faker.person.firstName(),
    cpf: faker.string.numeric(11),
    email: faker.internet.email(),
    password: faker.internet.password(),
    latitude: faker.location.latitude(),
    longitude: faker.location.longitude(),
    ...overwrite,
  })

  return courier
}
