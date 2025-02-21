import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { ValueObject } from '@/core/entities/value-object'
import { TrackingNumber } from './tracking-number'
import { Status } from './status'

export interface ParcelWithRecipientProps {
  parcelId: UniqueEntityID
  courierId?: UniqueEntityID | null
  trackingNumber: TrackingNumber
  currentStatus: Status
  recipientName: string
  recipientCpf: string
  recipientState: string
  recipientCity: string
  recipientZipCode: string
  recipientStreetAddress: string
  recipientNeighborhood: string
  createdAt: Date
  updatedAt?: Date | null
}

export class ParcelWithRecipient extends ValueObject<ParcelWithRecipientProps> {
  get parcelId() {
    return this.props.parcelId
  }

  get courierId() {
    return this.props.courierId
  }

  get trackingNumber() {
    return this.props.trackingNumber
  }

  get currentStatus() {
    return this.props.currentStatus
  }

  get recipientName() {
    return this.props.recipientName
  }

  get recipientCpf() {
    return this.props.recipientCpf
  }

  get recipientState() {
    return this.props.recipientState
  }

  get recipientCity() {
    return this.props.recipientCity
  }

  get recipientZipCode() {
    return this.props.recipientZipCode
  }

  get recipientStreetAddress() {
    return this.props.recipientStreetAddress
  }

  get recipientNeighborhood() {
    return this.props.recipientNeighborhood
  }

  get createdAt() {
    return this.props.createdAt
  }

  get updatedAt() {
    return this.props.updatedAt
  }

  static create(props: ParcelWithRecipientProps) {
    return new ParcelWithRecipient(props)
  }
}
