import {
  BadRequestException,
  ConflictException,
  Controller,
  HttpCode,
  NotFoundException,
  Param,
  Patch,
} from '@nestjs/common'
import { Role } from '@/infra/auth/role.decorator'
import { OutForDeliveryParcelService } from '@/domain/delivery/application/services/logistics/out-for-delivery-parcel.service'
import { ParcelNotAvailableError } from '@/core/errors/parcel-not-available-error'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'
import { ApiTags } from '@nestjs/swagger'

@ApiTags('Logistics')
@Controller('/parcels/:id/out-for-delivery')
@Role('MEMBER')
export class OutForDeliveryParcelController {
  constructor(private outForDeliveryParcel: OutForDeliveryParcelService) {}

  @Patch()
  @HttpCode(200)
  async handle(@Param('id') parcelId: string) {
    const result = await this.outForDeliveryParcel.execute({ parcelId })

    if (result.isLeft()) {
      const error = result.value

      switch (error.constructor) {
        case ResourceNotFoundError:
          throw new NotFoundException(error.message)
        case ParcelNotAvailableError:
          throw new ConflictException(error.message)
        default:
          throw new BadRequestException(error.message)
      }
    }
  }
}
