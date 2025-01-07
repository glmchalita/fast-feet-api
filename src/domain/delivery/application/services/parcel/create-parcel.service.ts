import { Either, left, right } from '@/core/either'
import { Parcel } from '@/domain/delivery/enterprise/entities/parcel'
import { ParcelsRepository } from '../../repositories/parcels-repository'
import { RecipientsRepository } from '../../repositories/recipients-repository'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'

interface CreateParcelServiceRequest {
  recipientId: string
}

type CreateParcelServiceResponse = Either<
  ResourceNotFoundError,
  {
    parcel: Parcel
  }
>

export class CreateParcelService {
  constructor(
    private parcelsRepository: ParcelsRepository,
    private recipientsRepository: RecipientsRepository,
  ) {}

  async execute({ recipientId }: CreateParcelServiceRequest): Promise<CreateParcelServiceResponse> {
    const recipient = await this.recipientsRepository.findById(recipientId)

    if (!recipient) return left(new ResourceNotFoundError())

    const parcel = Parcel.create({ recipientId: recipient.id })

    await this.parcelsRepository.create(parcel)

    return right({ parcel })
  }
}
