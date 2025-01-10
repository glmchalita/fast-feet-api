import { Recipient as PrismaRecipient, Prisma } from '@prisma/client'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Decimal } from '@prisma/client/runtime/library'
import { Recipient } from '@/domain/delivery/enterprise/entities/recipient'

export class PrismaRecipientMapper {
  static toDomain(raw: PrismaRecipient): Recipient {
    return Recipient.create(
      {
        name: raw.name,
        cpf: raw.cpf,
        email: raw.email,
        address: {
          state: raw.state,
          city: raw.city,
          zipCode: raw.zipCode,
          streetAddress: raw.streetAddress,
          neighborhood: raw.neighborhood,
          latitude: raw.latitude.toNumber(),
          longitude: raw.longitude.toNumber(),
        },
      },
      new UniqueEntityID(raw.id),
    )
  }

  static toPrisma(recipient: Recipient): Prisma.RecipientUncheckedCreateInput {
    return {
      id: recipient.id.toString(),
      name: recipient.name,
      cpf: recipient.cpf,
      email: recipient.email,
      state: recipient.address.state,
      city: recipient.address.city,
      zipCode: recipient.address.zipCode,
      streetAddress: recipient.address.streetAddress,
      neighborhood: recipient.address.neighborhood,
      latitude: new Decimal(recipient.address.latitude),
      longitude: new Decimal(recipient.address.longitude),
    }
  }
}
