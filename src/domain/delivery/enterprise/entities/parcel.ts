import { Entity } from '@/core/entities/entity'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'

export interface ParcelProps {
  recipientId: UniqueEntityID
  transporterId: UniqueEntityID
  status: string
  createdAt: Date
  updatedAt?: Date | null
}

export class Parcel extends Entity<ParcelProps> {
  get recipientId() {
    return this.props.recipientId
  }

  static create(props: ParcelProps, id?: UniqueEntityID) {
    const parcel = new Parcel(props, id)

    return parcel
  }
}
