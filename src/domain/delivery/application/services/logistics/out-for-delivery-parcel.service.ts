import { Either, left, right } from '@/core/either'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'
import { ParcelNotAvailableError } from '@/core/errors/parcel-not-available-error'
import { ParcelsRepository } from '../../repositories/parcels-repository'
import { Injectable } from '@nestjs/common'

interface OutForDeliveryParcelServiceRequest {
  parcelId: string
}

type OutForDeliveryParcelServiceResponse = Either<
  ResourceNotFoundError | ParcelNotAvailableError,
  null
>

@Injectable()
export class OutForDeliveryParcelService {
  constructor(private parcelsRepository: ParcelsRepository) {}

  async execute({
    parcelId,
  }: OutForDeliveryParcelServiceRequest): Promise<OutForDeliveryParcelServiceResponse> {
    const parcel = await this.parcelsRepository.findById(parcelId)

    if (!parcel) return left(new ResourceNotFoundError())

    const result = parcel.markOutForDelivery()

    if (result.isLeft()) {
      return left(new ParcelNotAvailableError(parcel))
    }

    await this.parcelsRepository.save(parcel)

    return right(null)
  }
}
