import { Parcel, ParcelProps } from '@/domain/delivery/enterprise/entities/parcel'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'

export function makeParcel(overwrite: Partial<ParcelProps> = {}) {
  const parcel = Parcel.create({
    recipientId: new UniqueEntityID(),
    ...overwrite,
  })

  return parcel
}
