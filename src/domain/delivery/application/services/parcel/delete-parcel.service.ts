import { Either, left, right } from '@/core/either'
import { ParcelsRepository } from '../../repositories/parcels-repository'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'

interface DeleteParcelServiceRequest {
  parcelId: string
}

type DeleteParcelServiceResponse = Either<ResourceNotFoundError, null>

export class DeleteParcelService {
  constructor(private parcelsRepository: ParcelsRepository) {}

  async execute({ parcelId }: DeleteParcelServiceRequest): Promise<DeleteParcelServiceResponse> {
    const parcel = await this.parcelsRepository.findById(parcelId)

    if (!parcel) return left(new ResourceNotFoundError())

    await this.parcelsRepository.delete(parcel)

    return right(null)
  }
}
