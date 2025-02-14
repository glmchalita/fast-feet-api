import { Either, left, right } from '@/core/either'
import { ParcelsRepository } from '../../repositories/parcels-repository'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'
import { CouriersRepository } from '../../repositories/couriers-repository'
import { Parcel } from '@/domain/delivery/enterprise/entities/parcel'
import { Injectable } from '@nestjs/common'

interface UpdateParcelCourierServiceRequest {
  parcelId: string
  courierId: string
}

type UpdateParcelCourierServiceResponse = Either<ResourceNotFoundError, { parcel: Parcel }>

@Injectable()
export class UpdateParcelCourierService {
  constructor(
    private parcelsRepository: ParcelsRepository,
    private couriersRepository: CouriersRepository,
  ) {}

  async execute({
    parcelId,
    courierId,
  }: UpdateParcelCourierServiceRequest): Promise<UpdateParcelCourierServiceResponse> {
    const parcel = await this.parcelsRepository.findById(parcelId)

    if (!parcel) return left(new ResourceNotFoundError())

    const courier = await this.couriersRepository.findById(courierId)

    if (!courier) return left(new ResourceNotFoundError())

    parcel.courierId = courier.id

    await this.parcelsRepository.save(parcel)

    return right({ parcel })
  }
}
