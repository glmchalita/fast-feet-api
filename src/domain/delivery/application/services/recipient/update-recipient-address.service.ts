import { Either, left, right } from '@/core/either'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'
import { RecipientsRepository } from '../../repositories/recipients-repository'
import { Address } from '@/domain/delivery/enterprise/value-objects/address'
import { Injectable } from '@nestjs/common'

interface UpdateRecipientAddressServiceRequest {
  recipientId: string
  state: string
  city: string
  zipCode: string
  streetAddress: string
  neighborhood: string
  latitude: number
  longitude: number
}

type UpdateRecipientAddressServiceResponse = Either<ResourceNotFoundError, null>

@Injectable()
export class UpdateRecipientAddressService {
  constructor(private recipientsRepository: RecipientsRepository) {}

  async execute({
    recipientId,
    state,
    city,
    zipCode,
    streetAddress,
    neighborhood,
    latitude,
    longitude,
  }: UpdateRecipientAddressServiceRequest): Promise<UpdateRecipientAddressServiceResponse> {
    const recipient = await this.recipientsRepository.findById(recipientId)

    if (!recipient) return left(new ResourceNotFoundError())

    const newAddress = Address.create({
      state,
      city,
      zipCode,
      streetAddress,
      neighborhood,
      latitude,
      longitude,
    })

    recipient.address = newAddress

    await this.recipientsRepository.save(recipient)

    return right(null)
  }
}
