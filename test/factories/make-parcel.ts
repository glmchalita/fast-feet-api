import { Parcel, ParcelProps } from '@/domain/delivery/enterprise/entities/parcel'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Injectable } from '@nestjs/common'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { PrismaParcelMapper } from '@/infra/database/prisma/mappers/prisma-parcel-mapper'
import { RecipientFactory } from './make-recipient'

export function makeParcel(overwrite: Partial<ParcelProps> = {}) {
  const parcel = Parcel.create({
    recipientId: new UniqueEntityID(),
    ...overwrite,
  })

  return parcel
}

@Injectable()
export class ParcelFactory {
  constructor(
    private prisma: PrismaService,
    private recipientFactory: RecipientFactory,
  ) {}

  async makePrismaParcel(data: Partial<ParcelProps> = {}): Promise<Parcel> {
    let recipientId = data.recipientId

    if (!recipientId) {
      const recipient = await this.recipientFactory.makePrismaRecipient()

      recipientId = recipient.id
    }

    const parcel = makeParcel({ ...data, recipientId })

    await this.prisma.parcel.create({
      data: PrismaParcelMapper.toPrisma(parcel),
    })

    await this.prisma.statusHistory.create({
      data: {
        parcelId: parcel.id.toString(),
        status: 'ORDER_CREATED',
        date: new Date(),
      },
    })

    return parcel
  }
}
