import { PrismaService } from '../prisma.service'
import { Injectable } from '@nestjs/common'
import { RecipientsRepository } from '@/domain/delivery/application/repositories/recipients-repository'
import { Recipient } from '@/domain/delivery/enterprise/entities/recipient'
import { PrismaRecipientMapper } from '../mappers/prisma-recipient-mapper'

@Injectable()
export class PrismaRecipientsRepository implements RecipientsRepository {
  constructor(private prisma: PrismaService) {}

  async create(recipient: Recipient): Promise<void> {
    const data = PrismaRecipientMapper.toPrisma(recipient)

    await this.prisma.recipient.create({
      data,
    })
  }

  async delete(recipient: Recipient): Promise<void> {
    const data = PrismaRecipientMapper.toPrisma(recipient)

    await this.prisma.recipient.delete({
      where: { id: data.id },
    })
  }

  async save(recipient: Recipient): Promise<void> {
    const data = PrismaRecipientMapper.toPrisma(recipient)

    await this.prisma.recipient.update({
      where: {
        id: recipient.id.toString(),
      },
      data,
    })
  }

  async findByCpf(cpf: string): Promise<Recipient | null> {
    const recipient = await this.prisma.recipient.findUnique({
      where: {
        cpf,
      },
    })

    if (!recipient) return null

    return PrismaRecipientMapper.toDomain(recipient)
  }

  async findById(id: string): Promise<Recipient | null> {
    const recipient = await this.prisma.recipient.findUnique({
      where: {
        id,
      },
    })

    if (!recipient) return null

    return PrismaRecipientMapper.toDomain(recipient)
  }
}
