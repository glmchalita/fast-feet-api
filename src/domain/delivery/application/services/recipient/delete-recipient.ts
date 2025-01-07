import { Either, left, right } from '@/core/either'
import { Injectable } from '@nestjs/common'
import { RecipientsRepository } from '../../repositories/recipients-repository'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'

interface DeleteRecipientServiceRequest {
  recipientId: string
}

type DeleteRecipientServiceResponse = Either<ResourceNotFoundError, null>

@Injectable()
export class DeleteRecipientService {
  constructor(private recipientsRepository: RecipientsRepository) {}

  async execute({
    recipientId,
  }: DeleteRecipientServiceRequest): Promise<DeleteRecipientServiceResponse> {
    const recipient = await this.recipientsRepository.findById(recipientId)

    if (!recipient) return left(new ResourceNotFoundError())

    await this.recipientsRepository.delete(recipient)

    return right(null)
  }
}
