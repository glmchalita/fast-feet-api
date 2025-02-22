import { Either, left, right } from '@/core/either'
import { Notification } from '../../enterprise/entities/notification'
import { NotificationsRepository } from '../repositories/notifications-repository'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'
import { NotAllowedError } from '@/core/errors/not-allowed-error'
import { Injectable } from '@nestjs/common'

interface ReadNotificationServiceRequest {
  recipientId: string
  notificationId: string
}

type ReadNotificationServiceResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  {
    notification: Notification
  }
>

@Injectable()
export class ReadNotificationService {
  constructor(private notificationsRepository: NotificationsRepository) {}

  async execute({
    recipientId,
    notificationId,
  }: ReadNotificationServiceRequest): Promise<ReadNotificationServiceResponse> {
    const notification = await this.notificationsRepository.findById(notificationId)

    if (!notification) return left(new ResourceNotFoundError())

    if (recipientId !== notification.recipientId.toString()) return left(new NotAllowedError())

    notification.read()

    await this.notificationsRepository.save(notification)

    return right({ notification })
  }
}
