import { Either, left, right } from '@/core/either'
import { Attachment } from '../../enterprise/entities/attachment'
import { InvalidAttachmentTypeError } from '@/core/errors/invalid-attachment-type-error'
import { AttachmentsRepository } from '../repositories/attachments-repository'
import { Uploader } from '../storage/uploader'
import { Injectable } from '@nestjs/common'

interface UploadAttachmentServiceRequest {
  fileName: string
  fileType: string
  body: Buffer
}

type UploadAttachmentServiceResponse = Either<
  InvalidAttachmentTypeError,
  {
    attachment: Attachment
  }
>

@Injectable()
export class UploadAttachmentService {
  constructor(
    private attachmentsRepository: AttachmentsRepository,
    private uploader: Uploader,
  ) {}

  async execute({
    fileName,
    fileType,
    body,
  }: UploadAttachmentServiceRequest): Promise<UploadAttachmentServiceResponse> {
    if (!/^(image\/(jpeg|png))$/.test(fileType)) {
      return left(new InvalidAttachmentTypeError(fileType))
    }

    const { url } = await this.uploader.upload({
      fileName,
      fileType,
      body,
    })

    const attachment = Attachment.create({
      title: fileName,
      url,
    })

    await this.attachmentsRepository.create(attachment)

    return right({ attachment })
  }
}
