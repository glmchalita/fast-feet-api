import { Either, left, right } from '@/core/either'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'
import { ParcelNotAvailableError } from '@/core/errors/parcel-not-available-error'
import { ParcelsRepository } from '../../repositories/parcels-repository'
import { ParcelAttachment } from '@/domain/delivery/enterprise/entities/parcel-attachment'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'

interface DeliveryParcelServiceRequest {
  parcelId: string
  attachmentId: string
}

type DeliveryParcelServiceResponse = Either<ResourceNotFoundError | ParcelNotAvailableError, null>

export class DeliveryParcelService {
  constructor(private parcelsRepository: ParcelsRepository) {}

  async execute({
    parcelId,
    attachmentId,
  }: DeliveryParcelServiceRequest): Promise<DeliveryParcelServiceResponse> {
    const parcel = await this.parcelsRepository.findById(parcelId)

    if (!parcel) return left(new ResourceNotFoundError())

    const attachment = ParcelAttachment.create({
      parcelId: parcel.id,
      attachmentId: new UniqueEntityID(attachmentId),
    })

    parcel.attachment = attachment

    const result = parcel.markDelivered()

    if (result.isLeft()) {
      return left(new ParcelNotAvailableError(parcel))
    }

    await this.parcelsRepository.save(parcel)

    return right(null)
  }
}
