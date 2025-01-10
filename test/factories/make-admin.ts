import { Admin, AdminProps } from '@/domain/delivery/enterprise/entities/admin'
import { PrismaAdminMapper } from '@/infra/database/prisma/mappers/prisma-admin-mapper'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { faker } from '@faker-js/faker'
import { Injectable } from '@nestjs/common'

export function makeAdmin(overwrite: Partial<AdminProps> = {}) {
  const admin = Admin.create({
    name: faker.person.firstName(),
    email: faker.internet.email(),
    password: faker.internet.password(),
    ...overwrite,
  })

  return admin
}

@Injectable()
export class AdminFactory {
  constructor(private prisma: PrismaService) {}

  async makePrismaAdmin(data: Partial<AdminProps> = {}): Promise<Admin> {
    const admin = makeAdmin(data)

    await this.prisma.admin.create({
      data: PrismaAdminMapper.toPrisma(admin),
    })

    return admin
  }
}
