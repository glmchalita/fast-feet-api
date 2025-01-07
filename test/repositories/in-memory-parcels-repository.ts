import { DomainEvents } from '@/core/events/domain-events'
import { PaginationParams } from '@/core/repositories/pagination-params'
import {
  FindManyNearbyParams,
  ParcelsRepository,
} from '@/domain/delivery/application/repositories/parcels-repository'
import { getDistanceBetweenCoordinates } from '@/domain/delivery/application/utils/coordinates-calc'
import { Parcel } from '@/domain/delivery/enterprise/entities/parcel'
import { InMemoryRecipientsRepository } from './in-memory-recipients-repository'

export class InMemoryParcelsRepository implements ParcelsRepository {
  public items: Parcel[] = []

  constructor(private recipientsRepository: InMemoryRecipientsRepository) {}

  async create(parcel: Parcel) {
    this.items.push(parcel)

    DomainEvents.dispatchEventsForAggregate(parcel.id)
  }

  async delete(parcel: Parcel): Promise<void> {
    const itemIndex = this.items.findIndex((item) => item.id === parcel.id)

    this.items.splice(itemIndex, 1)
  }

  async save(parcel: Parcel) {
    const itemIndex = this.items.findIndex((item) => item.id === parcel.id)

    this.items[itemIndex] = parcel

    DomainEvents.dispatchEventsForAggregate(parcel.id)
  }

  async findById(parcelId: string): Promise<Parcel | null> {
    const parcel = this.items.find((item) => item.id.toString() === parcelId)

    if (!parcel) return null

    return parcel
  }

  async findManyByCourierId(courierId: string, { page }: PaginationParams) {
    const parcels = this.items
      .filter((item) => item.courierId?.toString() === courierId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice((page - 1) * 20, page * 20)

    return parcels
  }

  async findManyNearby(params: FindManyNearbyParams, { page }: PaginationParams) {
    const recipients = this.recipientsRepository.items

    return this.items
      .filter((item) => {
        const recipient = recipients.find((recipient) => recipient.id.equals(item.recipientId))

        if (!recipient) throw new Error('No recipients found')

        const distance = getDistanceBetweenCoordinates(
          { latitude: params.latitude, longitude: params.longitude },
          { latitude: recipient.address.latitude, longitude: recipient.address.longitude },
        )

        return distance < 10
      })
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice((page - 1) * 20, page * 20)
  }
}
