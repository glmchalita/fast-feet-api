import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Optional } from '@/core/types/optional'
import { Status } from '../value-objects/status'
import { TrackingNumber } from '../value-objects/tracking-number'
import { AggregateRoot } from '@/core/entities/aggregate-root'
import { ParcelStatusUpdatedEvent } from '../events/parcel-status-updated-event'
import { ParcelAttachment } from './parcel-attachment'
import { StatusHistory } from '../value-objects/status-history'
import { Either, left, right } from '@/core/either'

export interface ParcelProps {
  recipientId: UniqueEntityID
  trackingNumber: TrackingNumber
  courierId?: UniqueEntityID | null
  attachment?: ParcelAttachment | null
  currentStatus: Status
  statusHistory: StatusHistory[]
  createdAt: Date
  updatedAt?: Date | null
}

export class Parcel extends AggregateRoot<ParcelProps> {
  get recipientId() {
    return this.props.recipientId
  }

  get trackingNumber() {
    return this.props.trackingNumber
  }

  get courierId(): UniqueEntityID | null | undefined {
    return this.props.courierId
  }

  get attachment(): ParcelAttachment | null | undefined {
    return this.props.attachment
  }

  get currentStatus() {
    return this.props.currentStatus
  }

  get statusHistory() {
    return this.props.statusHistory
  }

  get createdAt() {
    return this.props.createdAt
  }

  get updatedAt() {
    return this.props.updatedAt
  }

  set courierId(courierId: UniqueEntityID) {
    this.props.courierId = courierId
  }

  set attachment(attachment: ParcelAttachment) {
    this.props.attachment = attachment
  }

  set currentStatus(status: Status) {
    this.props.currentStatus = status
  }

  markReadyForCollect(): Either<Error, void> {
    if (!Status.isValidTransition(this.props.currentStatus, Status.READY_FOR_COLLECT)) {
      return left(
        new Error(
          `Invalid status transition: ${this.props.currentStatus.getValue()} -> Ready for Pickup`,
        ),
      )
    }

    this.props.currentStatus = Status.READY_FOR_COLLECT
    this.props.updatedAt = new Date()
    this.props.statusHistory.push(new StatusHistory(Status.READY_FOR_COLLECT, new Date()))
    this.addDomainEvent(new ParcelStatusUpdatedEvent(this))

    return right(undefined)
  }

  markCollected(): Either<Error, void> {
    if (!Status.isValidTransition(this.props.currentStatus, Status.COLLECTED)) {
      return left(
        new Error(`Invalid status transition: ${this.props.currentStatus.getValue()} -> Collected`),
      )
    }

    this.props.currentStatus = Status.COLLECTED
    this.props.updatedAt = new Date()
    this.props.statusHistory.push(new StatusHistory(Status.COLLECTED, new Date()))
    this.addDomainEvent(new ParcelStatusUpdatedEvent(this))

    return right(undefined)
  }

  markOutForDelivery(): Either<Error, void> {
    if (!Status.isValidTransition(this.props.currentStatus, Status.OUT_FOR_DELIVERY)) {
      return left(
        new Error(
          `Invalid status transition: ${this.props.currentStatus.getValue()} -> Out for Delivery`,
        ),
      )
    }

    this.props.currentStatus = Status.OUT_FOR_DELIVERY
    this.props.updatedAt = new Date()
    this.props.statusHistory.push(new StatusHistory(Status.OUT_FOR_DELIVERY, new Date()))
    this.addDomainEvent(new ParcelStatusUpdatedEvent(this))

    return right(undefined)
  }

  markDelivered(): Either<Error, void> {
    if (!Status.isValidTransition(this.props.currentStatus, Status.DELIVERED)) {
      return left(
        new Error(`Invalid status transition: ${this.props.currentStatus.getValue()} -> Delivered`),
      )
    }

    this.props.currentStatus = Status.DELIVERED
    this.props.updatedAt = new Date()
    this.props.statusHistory.push(new StatusHistory(Status.DELIVERED, new Date()))
    this.addDomainEvent(new ParcelStatusUpdatedEvent(this))

    return right(undefined)
  }

  markReturned(): Either<Error, void> {
    if (!Status.isValidTransition(this.props.currentStatus, Status.RETURNED)) {
      return left(
        new Error(`Invalid status transition: ${this.props.currentStatus.getValue()} -> Returned`),
      )
    }

    this.props.currentStatus = Status.RETURNED
    this.props.updatedAt = new Date()
    this.props.statusHistory.push(new StatusHistory(Status.RETURNED, new Date()))
    this.addDomainEvent(new ParcelStatusUpdatedEvent(this))

    return right(undefined)
  }

  static create(
    props: Optional<
      ParcelProps,
      'trackingNumber' | 'currentStatus' | 'statusHistory' | 'createdAt'
    >,
    id?: UniqueEntityID,
  ) {
    const parcel = new Parcel(
      {
        ...props,
        trackingNumber: props.trackingNumber ?? new TrackingNumber(),
        currentStatus: props.currentStatus ?? Status.ORDER_CREATED,
        statusHistory: props.statusHistory ?? [new StatusHistory(Status.ORDER_CREATED, new Date())],
        createdAt: props.createdAt ?? new Date(),
      },
      id,
    )

    const isNewParcel = !id

    if (isNewParcel) {
      parcel.addDomainEvent(new ParcelStatusUpdatedEvent(parcel))
    }

    return parcel
  }
}
