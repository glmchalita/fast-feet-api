import { ParcelAttachmentRepository } from '@/domain/delivery/application/repositories/parcel-attachment-repository'
import { ParcelAttachment } from '@/domain/delivery/enterprise/entities/parcel-attachment'

export class InMemoryParcelAttachmentRepository implements ParcelAttachmentRepository {
  public items: ParcelAttachment[] = []

  async create(parcelAttachment: ParcelAttachment): Promise<void> {
    this.items.push(parcelAttachment)
  }
}
