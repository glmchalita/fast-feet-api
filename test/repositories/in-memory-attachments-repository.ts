import { AttachmentsRepository } from '@/domain/delivery/application/repositories/attachments-repository'
import { Attachment } from '@/domain/delivery/enterprise/entities/attachment'

export class InMemoryAttachmentsRepository implements AttachmentsRepository {
  public items: Attachment[] = []

  async create(attachment: Attachment) {
    this.items.push(attachment)
  }
}
