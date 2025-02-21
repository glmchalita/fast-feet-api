import { ParcelWithRecipient } from '@/domain/delivery/enterprise/value-objects/parcel-with-recipient'

export class ParcelWithRecipientPresenter {
  static toHTTP(parcelWithRecipient: ParcelWithRecipient) {
    return {
      parcelId: parcelWithRecipient.parcelId.toString(),
      courierId: parcelWithRecipient.courierId?.toString(),
      trackingNumber: parcelWithRecipient.trackingNumber.toString(),
      currentStatus: parcelWithRecipient.currentStatus,
      recipientName: parcelWithRecipient.recipientName,
      recipientCpf: parcelWithRecipient.recipientCpf,
      state: parcelWithRecipient.recipientState,
      city: parcelWithRecipient.recipientCity,
      zipCode: parcelWithRecipient.recipientZipCode,
      streetAddress: parcelWithRecipient.recipientStreetAddress,
      neighborhood: parcelWithRecipient.recipientNeighborhood,
      createdAt: parcelWithRecipient.createdAt,
      updatedAt: parcelWithRecipient.updatedAt,
    }
  }
}
