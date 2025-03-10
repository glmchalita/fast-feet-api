import { InMemoryAttachmentsRepository } from 'test/repositories/in-memory-attachments-repository'
import { UploadAttachmentService } from './upload-attachment.service'
import { FakeUploader } from 'test/storage/fake-uploader'
import { InvalidAttachmentTypeError } from '@/core/errors/invalid-attachment-type-error'

describe('Upload attachment', () => {
  let inMemoryAttachmentsRepository: InMemoryAttachmentsRepository
  let fakeUploader: FakeUploader
  let sut: UploadAttachmentService

  beforeEach(() => {
    inMemoryAttachmentsRepository = new InMemoryAttachmentsRepository()
    fakeUploader = new FakeUploader()
    sut = new UploadAttachmentService(inMemoryAttachmentsRepository, fakeUploader)
  })

  it('should be able to upload and create an attachment', async () => {
    const result = await sut.execute({
      fileName: 'profile.png',
      fileType: 'image/png',
      body: Buffer.from(''),
    })

    expect(result.isRight()).toBe(true)
    expect(result.value).toEqual({
      attachment: inMemoryAttachmentsRepository.items[0],
    })
    expect(fakeUploader.uploads).toHaveLength(1)
    expect(fakeUploader.uploads[0]).toEqual(
      expect.objectContaining({
        fileName: 'profile.png',
      }),
    )
  })

  it('should not be able to upload an attachment with invalid file type', async () => {
    const result = await sut.execute({
      fileName: 'profile.mp3',
      fileType: 'audio/mpeg',
      body: Buffer.from(''),
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(InvalidAttachmentTypeError)
  })
})
