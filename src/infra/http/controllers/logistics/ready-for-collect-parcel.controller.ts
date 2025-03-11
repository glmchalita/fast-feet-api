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
import { ReadyForCollectParcelService } from '@/domain/delivery/application/services/logistics/ready-for-collect-parcel.service'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'
import { ParcelNotAvailableError } from '@/core/errors/parcel-not-available-error'
import { ApiTags } from '@nestjs/swagger'

@ApiTags('Logistics')
@Controller('/parcels/:id/ready-for-collect')
@Role('ADMIN')
export class ReadyForCollectParcelController {
  constructor(private readyForCollectParcel: ReadyForCollectParcelService) {}

  @Patch()
  @HttpCode(200)
  async handle(@Param('id') parcelId: string) {
    const result = await this.readyForCollectParcel.execute({ parcelId })

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
