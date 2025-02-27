import { ParcelsRepository } from '@/domain/delivery/application/repositories/parcels-repository'
import { SendNotificationService } from '../service/send-notification.service'
import { EventHandler } from '@/core/events/event-handler'
import { DomainEvents } from '@/core/events/domain-events'
import { ParcelStatusUpdatedEvent } from '@/domain/delivery/enterprise/events/parcel-status-updated-event'
import { Injectable } from '@nestjs/common'

@Injectable()
export class OnParcelStatusUpdate implements EventHandler {
  constructor(
    private parcelsRepository: ParcelsRepository,
    private sendNotification: SendNotificationService,
  ) {
    this.setupSubscriptions()
  }

  setupSubscriptions(): void {
    DomainEvents.register(this.sendNewAnswerNotification.bind(this), ParcelStatusUpdatedEvent.name)
  }

  private async sendNewAnswerNotification({ parcel }: ParcelStatusUpdatedEvent) {
    try {
      await this.sendNotification.execute({
        recipientId: parcel.recipientId.toString(),
        trackingNumber: parcel.trackingNumber.toString(),
        title: `Your order ${parcel.trackingNumber.toString()} status has been updated.`,
      })
    } catch (error) {
      console.log(error)
    }
  }
}
