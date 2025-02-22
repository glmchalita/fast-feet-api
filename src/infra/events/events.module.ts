import { SendNotificationService } from '@/domain/notification/application/service/send-notification.service'
import { OnParcelStatusUpdate } from '@/domain/notification/application/subscribers/on-parcel-status-update'
import { Module } from '@nestjs/common'
import { DatabaseModule } from '../database/database.module'

@Module({
  imports: [DatabaseModule],
  providers: [OnParcelStatusUpdate, SendNotificationService],
})
export class EventsModule {}
