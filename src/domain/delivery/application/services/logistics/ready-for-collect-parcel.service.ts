import { Either, left, right } from '@/core/either'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'
import { ParcelNotAvailableError } from '@/core/errors/parcel-not-available-error'
import { ParcelsRepository } from '../../repositories/parcels-repository'
import { Injectable } from '@nestjs/common'

interface ReadyForCollectParcelServiceRequest {
  parcelId: string
}

type ReadyForCollectParcelServiceResponse = Either<
  ResourceNotFoundError | ParcelNotAvailableError,
  null
>

@Injectable()
export class ReadyForCollectParcelService {
  constructor(private parcelsRepository: ParcelsRepository) {}

  async execute({
    parcelId,
  }: ReadyForCollectParcelServiceRequest): Promise<ReadyForCollectParcelServiceResponse> {
    const parcel = await this.parcelsRepository.findById(parcelId)

    if (!parcel) return left(new ResourceNotFoundError())

    const result = parcel.markReadyForCollect()

    if (result.isLeft()) {
      return left(new ParcelNotAvailableError(parcel))
    }

    await this.parcelsRepository.save(parcel)

    return right(null)
  }
}
