import { PaginationParams } from '@/core/repositories/pagination-params'
import { Parcel } from '../../enterprise/entities/parcel'
import { ParcelWithRecipient } from '../../enterprise/value-objects/parcel-with-recipient'

export interface FindManyNearbyParams {
  latitude: number
  longitude: number
}

export abstract class ParcelsRepository {
  abstract create(parcel: Parcel): Promise<void>
  abstract delete(parcel: Parcel): Promise<void>
  abstract save(parcel: Parcel): Promise<void>
  abstract findById(id: string): Promise<Parcel | null>
  abstract findManyByCourierId(courierId: string, params: PaginationParams): Promise<Parcel[]>
  abstract findManyNearby(params: FindManyNearbyParams, page: PaginationParams): Promise<Parcel[]>

  abstract findManyByCourierIdWithRecipient(
    courierId: string,
    params: PaginationParams,
  ): Promise<ParcelWithRecipient[]>

  abstract findManyNearbyWithRecipient(
    params: FindManyNearbyParams,
    page: PaginationParams,
  ): Promise<ParcelWithRecipient[]>
}
