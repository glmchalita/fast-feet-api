import { Either, left, right } from '@/core/either'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'
import { NotAllowedError } from '@/core/errors/not-allowed-error'
import { ParcelsRepository } from '../repositories/parcels-repository'
import { CouriersRepository } from '../repositories/couriers-repository'
import { Injectable } from '@nestjs/common'
import { ParcelWithRecipient } from '../../enterprise/value-objects/parcel-with-recipient'

interface FetchDeliveriesByCourierServiceRequest {
  courierId: string
  page: number
}

type FetchDeliveriesByCourierServiceResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  {
    parcels: ParcelWithRecipient[]
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

    const parcels = await this.parcelsRepository.findManyByCourierIdWithRecipient(courierId, {
      page,
    })

    return right({ parcels })
  }
}
