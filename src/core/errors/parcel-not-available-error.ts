import { ServiceError } from '@/core/errors/service-error'
import { Parcel } from '@/domain/delivery/enterprise/entities/parcel'

export class ParcelNotAvailableError extends Error implements ServiceError {
  constructor(parcel: Parcel) {
    super(
      `Parcel ${parcel.id.toString()} are not available. Current status: ${parcel.currentStatus.getValue()}`,
    )
  }
}
