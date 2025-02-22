import { Notification as PrismaNotification, Prisma } from '@prisma/client'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Notification } from '@/domain/notification/enterprise/entities/notification'
import { TrackingNumber } from '@/domain/delivery/enterprise/value-objects/tracking-number'

export class PrismaNotificationMapper {
  static toDomain(raw: PrismaNotification): Notification {
    return Notification.create(
      {
        recipientId: new UniqueEntityID(raw.recipientId),
        trackingNumber: new TrackingNumber(raw.trackingNumber),
        title: raw.title,
        readAt: raw.readAt,
        createdAt: raw.createdAt,
      },
      new UniqueEntityID(raw.id),
    )
  }

  static toPrisma(notification: Notification): Prisma.NotificationUncheckedCreateInput {
    return {
      id: notification.id.toString(),
      recipientId: notification.recipientId.toString(),
      trackingNumber: notification.trackingNumber.toString(),
      title: notification.title,
      readAt: notification.readAt,
      createdAt: notification.createdAt,
    }
  }
}
