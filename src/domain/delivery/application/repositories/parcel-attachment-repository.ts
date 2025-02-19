import { ParcelAttachment } from '../../enterprise/entities/parcel-attachment'

export abstract class ParcelAttachmentRepository {
  abstract create(attachment: ParcelAttachment): Promise<void>
}
