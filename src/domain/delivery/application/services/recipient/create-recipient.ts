import { Recipient } from '@/domain/delivery/enterprise/entities/recipient'
import { RecipientsRepository } from '../../repositories/recipients-repository'
import { Either, left, right } from '@/core/either'
import { RecipientAlreadyExistsError } from '@/core/errors/recipient-already-exists-error'
import { Injectable } from '@nestjs/common'

interface CreateRecipientServiceRequest {
  name: string
  cpf: string
  email: string
  state: string
  city: string
  zipCode: string
  streetAddress: string
  neighborhood: string
  latitude: number
  longitude: number
}

type CreateRecipientServiceResponse = Either<
  RecipientAlreadyExistsError,
  {
    recipient: Recipient
  }
>

@Injectable()
export class CreateRecipientService {
  constructor(private recipientsRepository: RecipientsRepository) {}

  async execute({
    name,
    cpf,
    email,
    state,
    city,
    zipCode,
    streetAddress,
    neighborhood,
    latitude,
    longitude,
  }: CreateRecipientServiceRequest): Promise<CreateRecipientServiceResponse> {
    const recipientWithSameCpf = await this.recipientsRepository.findByCpf(cpf)

    if (recipientWithSameCpf) {
      return left(new RecipientAlreadyExistsError(cpf))
    }

    const recipient = Recipient.create({
      name,
      cpf,
      email,
      address: {
        state,
        city,
        zipCode,
        streetAddress,
        neighborhood,
        latitude,
        longitude,
      },
    })

    await this.recipientsRepository.create(recipient)

    return right({ recipient })
  }
}
