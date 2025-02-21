import { Parcel } from '@/domain/delivery/enterprise/entities/parcel'

export class ParcelPresenter {
  static toHTTP(parcel: Parcel<any>) {
    return {
      id: parcel.id.toString(),
      trackingNumber: parcel.trackingNumber,
      currentStatus: parcel.currentStatus,
      state: parcel.recipient.state,
      city: parcel.recipient.city,
      zipCode: parcel.recipient.zipCode,
      streetAddress: parcel.recipient.streetAddress,
      neighborhood: parcel.recipient.neighborhood,
      createdAt: parcel.createdAt,
      updatedAt: parcel.updatedAt,
    }
  }
}
