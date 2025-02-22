import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Either, right } from '@/core/either'
import { Notification } from '../../enterprise/entities/notification'
import { NotificationsRepository } from '../repositories/notifications-repository'
import { Injectable } from '@nestjs/common'
import { TrackingNumber } from '@/domain/delivery/enterprise/value-objects/tracking-number'

export interface SendNotificationServiceRequest {
  recipientId: string
  trackingNumber: string
  title: string
}

export type SendNotificationServiceResponse = Either<
  null,
  {
    notification: Notification
  }
>

@Injectable()
export class SendNotificationService {
  constructor(private notificationsRepository: NotificationsRepository) {}

  async execute({
    recipientId,
    trackingNumber,
    title,
  }: SendNotificationServiceRequest): Promise<SendNotificationServiceResponse> {
    const notification = Notification.create({
      recipientId: new UniqueEntityID(recipientId),
      trackingNumber: new TrackingNumber(trackingNumber),
      title,
    })

    await this.notificationsRepository.create(notification)

    return right({ notification })
  }
}
