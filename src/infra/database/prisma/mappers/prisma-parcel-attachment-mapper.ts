import { Prisma, Attachment as PrismaAttachment } from '@prisma/client'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { ParcelAttachment } from '@/domain/delivery/enterprise/entities/parcel-attachment'

export class PrismaParcelAttachmentMapper {
  static toDomain(raw: PrismaAttachment): ParcelAttachment {
    if (!raw.parcelId) {
      throw new Error('Invalid attachment type.')
    }

    return ParcelAttachment.create(
      {
        attachmentId: new UniqueEntityID(raw.id),
        parcelId: new UniqueEntityID(raw.parcelId),
      },
      new UniqueEntityID(raw.id),
    )
  }

  static toPrismaUpdate(attachment: ParcelAttachment): Prisma.AttachmentUpdateArgs {
    const attachmentId = attachment.attachmentId.toString()

    return {
      where: {
        id: attachmentId,
      },
      data: {
        parcelId: attachment.parcelId.toString(),
      },
    }
  }
}
