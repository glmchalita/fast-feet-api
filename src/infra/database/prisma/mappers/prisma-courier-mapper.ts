import { User as PrismaUser, Prisma } from '@prisma/client'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Courier } from '@/domain/delivery/enterprise/entities/courier'

export class PrismaCourierMapper {
  static toDomain(raw: PrismaUser): Courier {
    return Courier.create(
      {
        name: raw.name,
        cpf: raw.cpf as string,
        email: raw.email,
        password: raw.password,
      },
      new UniqueEntityID(raw.id),
    )
  }

  static toPrisma(courier: Courier): Prisma.UserUncheckedCreateInput {
    return {
      id: courier.id.toString(),
      name: courier.name,
      email: courier.email,
      password: courier.password,
      role: 'MEMBER',
      cpf: courier.cpf,
    }
  }
}
