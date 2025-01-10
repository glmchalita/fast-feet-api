import { Courier as PrismaCourier, Prisma } from '@prisma/client'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Courier } from '@/domain/delivery/enterprise/entities/courier'

export class PrismaCourierMapper {
  static toDomain(raw: PrismaCourier): Courier {
    return Courier.create(
      {
        name: raw.name,
        cpf: raw.cpf,
        email: raw.email,
        password: raw.password,
      },
      new UniqueEntityID(raw.id),
    )
  }

  static toPrisma(courier: Courier): Prisma.CourierUncheckedCreateInput {
    return {
      id: courier.id.toString(),
      name: courier.name,
      cpf: courier.cpf,
      email: courier.email,
      password: courier.password,
    }
  }
}
