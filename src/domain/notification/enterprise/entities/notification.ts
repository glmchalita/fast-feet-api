import { Entity } from '@/core/entities/entity'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Optional } from '@/core/types/optional'
import { TrackingNumber } from '@/domain/delivery/enterprise/value-objects/tracking-number'

export interface NotificationProps {
  recipientId: UniqueEntityID
  trackingNumber: TrackingNumber
  title: string
  readAt?: Date | null
  createdAt: Date
}
export class Notification extends Entity<NotificationProps> {
  get recipientId() {
    return this.props.recipientId
  }

  get trackingNumber() {
    return this.props.trackingNumber
  }

  get title() {
    return this.props.title
  }

  get readAt() {
    return this.props.readAt
  }

  get createdAt() {
    return this.props.createdAt
  }

  read() {
    this.props.readAt = new Date()
  }

  static create(props: Optional<NotificationProps, 'createdAt'>, id?: UniqueEntityID) {
    const notification = new Notification(
      {
        ...props,
        createdAt: props.createdAt ?? new Date(),
      },
      id,
    )

    return notification
  }
}
