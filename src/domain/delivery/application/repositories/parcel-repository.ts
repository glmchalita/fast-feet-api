import { Parcel } from '../../enterprise/entities/parcel'

export abstract class ParcelRepository {
  abstract create(parcel: Parcel): Promise<void>
  // abstract findByEmail(email: string): Promise<Parcel | null>
}
