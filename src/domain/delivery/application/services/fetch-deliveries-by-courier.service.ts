import { Either, left, right } from '@/core/either'
import { Parcel } from '@/domain/delivery/enterprise/entities/parcel'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'
import { NotAllowedError } from '@/core/errors/not-allowed-error'
import { ParcelsRepository } from '../repositories/parcels-repository'
import { CouriersRepository } from '../repositories/couriers-repository'
import { Injectable } from '@nestjs/common'

interface FetchDeliveriesByCourierServiceRequest {
  courierId: string
  page: number
}

type FetchDeliveriesByCourierServiceResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  {
    parcels: Parcel[]
  }
>

@Injectable()
export class FetchDeliveriesByCourierService {
  constructor(
    private parcelsRepository: ParcelsRepository,
    private couriersRepository: CouriersRepository,
  ) {}

  async execute({
    courierId,
    page,
  }: FetchDeliveriesByCourierServiceRequest): Promise<FetchDeliveriesByCourierServiceResponse> {
    const courier = await this.couriersRepository.findById(courierId)

    if (!courier) return left(new ResourceNotFoundError())

    if (courier.id.toString() !== courierId) return left(new NotAllowedError())

    const parcels = await this.parcelsRepository.findManyByCourierId(courierId, { page })

    return right({ parcels })
  }
}
