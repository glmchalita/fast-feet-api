import { Either, right } from '@/core/either'
import { ParcelsRepository } from '../repositories/parcels-repository'
import { Injectable } from '@nestjs/common'
import { ParcelWithRecipient } from '../../enterprise/value-objects/parcel-with-recipient'

interface FetchNearbyDeliveriesServiceRequest {
  courierLatitude: number
  courierLongitude: number
  page: number
}

type FetchNearbyDeliveriesServiceResponse = Either<
  null,
  {
    parcels: ParcelWithRecipient[]
  }
>

@Injectable()
export class FetchNearbyDeliveriesService {
  constructor(private parcelsRepository: ParcelsRepository) {}

  async execute({
    courierLatitude,
    courierLongitude,
    page,
  }: FetchNearbyDeliveriesServiceRequest): Promise<FetchNearbyDeliveriesServiceResponse> {
    const parcels = await this.parcelsRepository.findManyNearbyWithRecipient(
      {
        latitude: courierLatitude,
        longitude: courierLongitude,
      },
      { page },
    )

    return right({ parcels })
  }
}
