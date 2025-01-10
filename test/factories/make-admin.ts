import { Admin, AdminProps } from '@/domain/delivery/enterprise/entities/admin'
import { faker } from '@faker-js/faker'

export function makeAdmin(overwrite: Partial<AdminProps> = {}) {
  const admin = Admin.create({
    name: faker.person.firstName(),
    email: faker.internet.email(),
    password: faker.internet.password(),
    ...overwrite,
  })

  return admin
}
