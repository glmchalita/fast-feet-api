import { Courier, CourierProps } from '@/domain/delivery/enterprise/entities/courier'
import { PrismaCourierMapper } from '@/infra/database/prisma/mappers/prisma-courier-mapper'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { faker } from '@faker-js/faker'
import { Injectable } from '@nestjs/common'

export function makeCourier(overwrite: Partial<CourierProps> = {}) {
  const courier = Courier.create({
    name: faker.person.firstName(),
    cpf: faker.string.numeric(11),
    email: faker.internet.email(),
    password: faker.internet.password(),
    ...overwrite,
  })

  return courier
}

@Injectable()
export class CourierFactory {
  constructor(private prisma: PrismaService) {}

  async makePrismaCourier(data: Partial<CourierProps> = {}): Promise<Courier> {
    const courier = makeCourier(data)

    await this.prisma.courier.create({
      data: PrismaCourierMapper.toPrisma(courier),
    })

    return courier
  }
}
