import { Entity } from '@/core/entities/entity'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'

export interface ParcelAttachmentProps {
  parcelId: UniqueEntityID
  attachmentId: UniqueEntityID
}

export class ParcelAttachment extends Entity<ParcelAttachmentProps> {
  get parcelId() {
    return this.props.parcelId
  }

  get attachmentId() {
    return this.props.attachmentId
  }

  static create(props: ParcelAttachmentProps, id?: UniqueEntityID) {
    const attachment = new ParcelAttachment(props, id)

    return attachment
  }
}
