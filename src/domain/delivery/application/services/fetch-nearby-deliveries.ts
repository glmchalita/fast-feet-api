import { Either, right } from '@/core/either'
import { Parcel } from '@/domain/delivery/enterprise/entities/parcel'
import { ParcelsRepository } from '../repositories/parcels-repository'
import { Injectable } from '@nestjs/common'

interface FetchNearbyDeliveriesServiceRequest {
  courierLatitude: number
  courierLongitude: number
  page: number
}

type FetchNearbyDeliveriesServiceResponse = Either<
  null,
  {
    parcels: Parcel[]
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
    const parcels = await this.parcelsRepository.findManyNearby(
      {
        latitude: courierLatitude,
        longitude: courierLongitude,
      },
      { page },
    )

    return right({ parcels })
  }
}
