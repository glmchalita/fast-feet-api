import {
  Parcel as PrismaParcel,
  Prisma,
  Status as PrismaStatus,
  StatusHistory as PrismaStatusHistory,
} from '@prisma/client'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Parcel } from '@/domain/delivery/enterprise/entities/parcel'
import { Status } from '@/domain/delivery/enterprise/value-objects/status'
import { TrackingNumber } from '@/domain/delivery/enterprise/value-objects/tracking-number'
import { StatusHistory } from '@/domain/delivery/enterprise/value-objects/status-history'

export class PrismaParcelMapper {
  static toDomain(raw: PrismaParcel & { statusHistory: PrismaStatusHistory[] }): Parcel {
    return Parcel.create(
      {
        recipientId: new UniqueEntityID(raw.recipientId),
        trackingNumber: new TrackingNumber(raw.trackingNumber),
        courierId: raw.courierId ? new UniqueEntityID(raw.courierId) : null,
        currentStatus: PrismaParcelMapper.toDomainStatus(raw.currentStatus),
        statusHistory: raw.statusHistory.map(
          (history) =>
            new StatusHistory(
              PrismaParcelMapper.toDomainStatus(history.status),
              new Date(history.date),
            ),
        ),
        createdAt: new Date(raw.createdAt),
        updatedAt: raw.updatedAt ? new Date(raw.updatedAt) : null,
      },
      new UniqueEntityID(raw.id),
    )
  }

  static toPrisma(parcel: Parcel): Prisma.ParcelUncheckedCreateInput {
    return {
      id: parcel.id.toString(),
      recipientId: parcel.recipientId.toString(),
      courierId: parcel.courierId?.toString(),
      trackingNumber: parcel.trackingNumber.toString(),
      currentStatus: PrismaParcelMapper.toPrismaStatus(parcel.currentStatus),
      createdAt: parcel.createdAt,
      updatedAt: parcel.updatedAt,
    }
  }

  static toPrismaStatus(currentStatus: Status): PrismaStatus {
    const statusMapping: Record<string, PrismaStatus> = {
      'Order created': PrismaStatus.ORDER_CREATED,
      'Ready for Collect': PrismaStatus.READY_FOR_COLLECT,
      Collected: PrismaStatus.COLLECTED,
      'Out for Delivery': PrismaStatus.OUT_FOR_DELIVERY,
      Delivered: PrismaStatus.DELIVERED,
      Returned: PrismaStatus.RETURNED,
    }

    const prismaStatus = statusMapping[currentStatus.getValue()]

    if (!prismaStatus) {
      throw new Error(`Invalid status: ${currentStatus.getValue()}`)
    }

    return prismaStatus
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
