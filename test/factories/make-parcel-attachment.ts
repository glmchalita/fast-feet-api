import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import {
  ParcelAttachmentProps,
  ParcelAttachment,
} from '@/domain/delivery/enterprise/entities/parcel-attachment'

export function makeParcelAttachment(overwrite: Partial<ParcelAttachmentProps> = {}) {
  const parcelAttachment = ParcelAttachment.create({
    parcelId: new UniqueEntityID(),
    attachmentId: new UniqueEntityID(),
    ...overwrite,
  })

  return parcelAttachment
}
