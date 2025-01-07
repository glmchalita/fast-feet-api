import { PaginationParams } from '@/core/repositories/pagination-params'
import { Parcel } from '../../enterprise/entities/parcel'

export interface FindManyNearbyParams {
  latitude: number
  longitude: number
}

export abstract class ParcelsRepository {
  abstract create(parcel: Parcel): Promise<void>
  abstract delete(parcel: Parcel): Promise<void>
  abstract save(parcel: Parcel): Promise<void>
  abstract findById(parcelId: string): Promise<Parcel | null>
  abstract findManyByCourierId(courierId: string, params: PaginationParams): Promise<Parcel[]>
  abstract findManyNearby(params: FindManyNearbyParams, page: PaginationParams): Promise<Parcel[]>
}
