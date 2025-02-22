import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { TrackingNumber } from '@/domain/delivery/enterprise/value-objects/tracking-number'
import {
  Notification,
  NotificationProps,
} from '@/domain/notification/enterprise/entities/notification'
import { faker } from '@faker-js/faker'

export function makeNotification(overwrite: Partial<NotificationProps> = {}, id?: UniqueEntityID) {
  const notification = Notification.create(
    {
      recipientId: new UniqueEntityID(),
      trackingNumber: new TrackingNumber(),
      title: faker.internet.displayName(),
      ...overwrite,
    },
    id,
  )

  return notification
}
