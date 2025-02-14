import { CouriersRepository } from '@/domain/delivery/application/repositories/couriers-repository'
import { PrismaService } from '../prisma.service'
import { Courier } from '@/domain/delivery/enterprise/entities/courier'
import { Injectable } from '@nestjs/common'
import { PrismaCourierMapper } from '../mappers/prisma-courier-mapper'

@Injectable()
export class PrismaCouriersRepository implements CouriersRepository {
  constructor(private prisma: PrismaService) {}

  async create(courier: Courier): Promise<void> {
    const data = PrismaCourierMapper.toPrisma(courier)

    await this.prisma.user.create({
      data,
    })
  }

  async delete(courier: Courier): Promise<void> {
    const data = PrismaCourierMapper.toPrisma(courier)

    await this.prisma.user.delete({
      where: { id: data.id },
    })
  }

  async save(courier: Courier): Promise<void> {
    const data = PrismaCourierMapper.toPrisma(courier)

    await this.prisma.user.update({
      where: {
        id: courier.id.toString(),
      },
      data,
    })
  }

  async findByCpf(cpf: string): Promise<Courier | null> {
    const courier = await this.prisma.user.findUnique({
      where: {
        cpf,
      },
    })

    if (!courier) return null

    return PrismaCourierMapper.toDomain(courier)
  }

  async findByEmail(email: string): Promise<Courier | null> {
    const courier = await this.prisma.user.findUnique({
      where: {
        email,
      },
    })

    if (!courier) return null

    return PrismaCourierMapper.toDomain(courier)
  }

  async findById(id: string): Promise<Courier | null> {
    const courier = await this.prisma.user.findUnique({
      where: {
        id,
      },
    })

    if (!courier) return null

    return PrismaCourierMapper.toDomain(courier)
  }

  async findByVehicleLicensePlate(licensePlate: string): Promise<Courier | null> {
    const license = licensePlate

    if (license) return null

    return null
  }
}
