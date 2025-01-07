import { Either, left, right } from '@/core/either'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'
import { ParcelNotAvailableError } from '@/core/errors/parcel-not-available-error'
import { CouriersRepository } from '../../repositories/couriers-repository'
import { ParcelsRepository } from '../../repositories/parcels-repository'

interface CollectParcelServiceRequest {
  parcelId: string
  courierId: string
}

type CollectParcelServiceResponse = Either<ResourceNotFoundError | ParcelNotAvailableError, null>

export class CollectParcelService {
  constructor(
    private parcelsRepository: ParcelsRepository,
    private couriersRepository: CouriersRepository,
  ) {}

  async execute({
    parcelId,
    courierId,
  }: CollectParcelServiceRequest): Promise<CollectParcelServiceResponse> {
    const parcel = await this.parcelsRepository.findById(parcelId)

    if (!parcel) return left(new ResourceNotFoundError())

    const courier = await this.couriersRepository.findById(courierId)

    if (!courier) return left(new ResourceNotFoundError())

    const result = parcel.markCollected()

    if (result.isLeft()) {
      return left(new ParcelNotAvailableError(parcel))
    }

    parcel.courierId = courier.id

    await this.parcelsRepository.save(parcel)

    return right(null)
  }
}
