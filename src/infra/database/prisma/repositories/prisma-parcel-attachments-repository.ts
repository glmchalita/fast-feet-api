import { PrismaService } from '../prisma.service'
import { Injectable } from '@nestjs/common'
import { ParcelAttachmentRepository } from '@/domain/delivery/application/repositories/parcel-attachment-repository'
import { ParcelAttachment } from '@/domain/delivery/enterprise/entities/parcel-attachment'
import { PrismaParcelAttachmentMapper } from '../mappers/prisma-parcel-attachment-mapper'

@Injectable()
export class PrismaParcelAttachmentRepository implements ParcelAttachmentRepository {
  constructor(private prisma: PrismaService) {}

  async create(attachment: ParcelAttachment): Promise<void> {
    if (!attachment) return

    const data = PrismaParcelAttachmentMapper.toPrismaUpdate(attachment)

    await this.prisma.attachment.update(data)
  }
}
