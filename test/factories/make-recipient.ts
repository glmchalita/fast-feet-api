import { Recipient, RecipientProps } from '@/domain/delivery/enterprise/entities/recipient'
import { AddressProps } from '@/domain/delivery/enterprise/value-objects/address'
import { PrismaRecipientMapper } from '@/infra/database/prisma/mappers/prisma-recipient-mapper'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { faker } from '@faker-js/faker'
import { Injectable } from '@nestjs/common'

type PartialRecipientProps = {
  [K in keyof RecipientProps]?: K extends 'address' ? Partial<AddressProps> : RecipientProps[K]
}

export function makeRecipient(overwrite: PartialRecipientProps = {}) {
  const recipient = Recipient.create({
    name: overwrite.name ?? faker.person.firstName(),
    cpf: overwrite.cpf ?? faker.string.numeric(11),
    email: overwrite.email ?? faker.internet.email(),
    address: {
      state: faker.location.state(),
      city: faker.location.city(),
      zipCode: faker.location.zipCode(),
      streetAddress: faker.location.streetAddress(),
      neighborhood: faker.location.county(),
      latitude: faker.location.latitude(),
      longitude: faker.location.longitude(),
      ...(overwrite.address || {}),
    },
  })

  return recipient
}

@Injectable()
export class RecipientFactory {
  constructor(private prisma: PrismaService) {}

  async makePrismaRecipient(data: PartialRecipientProps = {}): Promise<Recipient> {
    const recipient = makeRecipient(data)

    await this.prisma.recipient.create({
      data: PrismaRecipientMapper.toPrisma(recipient),
    })

    return recipient
  }
}
