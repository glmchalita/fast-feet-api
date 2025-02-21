import {
  Parcel as PrismaParcel,
  Status as PrismaStatus,
  Recipient as PrismaRecipient,
} from '@prisma/client'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Status } from '@/domain/delivery/enterprise/value-objects/status'
import { TrackingNumber } from '@/domain/delivery/enterprise/value-objects/tracking-number'
import { ParcelWithRecipient } from '@/domain/delivery/enterprise/value-objects/parcel-with-recipient'

type PrismaParcelWithRecipient = PrismaParcel & {
  recipient: PrismaRecipient
}

export class PrismaParcelWithRecipientMapper {
  static toDomain(raw: PrismaParcelWithRecipient): ParcelWithRecipient {
    return ParcelWithRecipient.create({
      parcelId: new UniqueEntityID(raw.id),
      courierId: raw.courierId ? new UniqueEntityID(raw.courierId) : null,
      trackingNumber: new TrackingNumber(raw.trackingNumber),
      currentStatus: PrismaParcelWithRecipientMapper.toDomainStatus(raw.currentStatus),
      recipientName: raw.recipient.name,
      recipientCpf: raw.recipient.cpf,
      recipientState: raw.recipient.state,
      recipientCity: raw.recipient.city,
      recipientZipCode: raw.recipient.zipCode,
      recipientStreetAddress: raw.recipient.streetAddress,
      recipientNeighborhood: raw.recipient.neighborhood,
      createdAt: new Date(raw.createdAt),
      updatedAt: raw.updatedAt ? new Date(raw.updatedAt) : null,
    })
  }

  static toDomainStatus(prismaStatus: PrismaStatus): Status {
    const statusMapping: Record<PrismaStatus, Status> = {
      [PrismaStatus.ORDER_CREATED]: Status.ORDER_CREATED,
      [PrismaStatus.READY_FOR_COLLECT]: Status.READY_FOR_COLLECT,
      [PrismaStatus.COLLECTED]: Status.COLLECTED,
      [PrismaStatus.OUT_FOR_DELIVERY]: Status.OUT_FOR_DELIVERY,
      [PrismaStatus.DELIVERED]: Status.DELIVERED,
      [PrismaStatus.RETURNED]: Status.RETURNED,
    }

    const domainStatus = statusMapping[prismaStatus]

    if (!domainStatus) {
      throw new Error(`Invalid Prisma status: ${prismaStatus}`)
    }

    return domainStatus
  }
}
