import { BadRequestException, Controller, HttpCode, Param, Patch } from '@nestjs/common'
import { ParcelWithRecipientPresenter } from '../presenters/parcel-with-recipient-presenter'
import { ReadNotificationService } from '@/domain/notification/application/service/read-notification.service'

@Controller('/notifications/:notificationId/read')
export class FetchNearbyDeliveriesController {
  constructor(private readNotification: ReadNotificationService) {}

  @Patch()
  @HttpCode(204)
  async handle(@Param('notificationId') notificationId: string) {
    const result = await this.readNotification.execute({
      notificationId,
      recipientId,
    })

    if (result.isLeft()) {
      throw new BadRequestException()
    }

    const parcels = result.value.parcels

    return { parcels: parcels.map(ParcelWithRecipientPresenter.toHTTP) }
  }
}
