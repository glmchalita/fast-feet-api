import { Entity } from '@/core/entities/entity'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Recipient } from '../value-objects/recipient'
import { Address } from '../value-objects/address'

export interface ParcelProps {
  courierId: UniqueEntityID
  recipient: Recipient
  address: Address
  status: string
  createdAt: Date
  updatedAt?: Date | null
}

export class Parcel extends Entity<ParcelProps> {
  get courierId() {
    return this.props.courierId
  }

  get recipient() {
    return this.props.recipient
  }

  get address() {
    return this.props.address
  }

  get status() {
    return this.props.status
  }

  static create(props: ParcelProps, id?: UniqueEntityID) {
    const parcel = new Parcel(props, id)

    return parcel
  }
}
