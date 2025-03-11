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
import { ReturnParcelService } from '@/domain/delivery/application/services/logistics/return-parcel.service'
import { ParcelNotAvailableError } from '@/core/errors/parcel-not-available-error'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'
import { ApiTags } from '@nestjs/swagger'

@ApiTags('Logistics')
@Controller('/parcels/:id/return')
@Role('MEMBER')
export class ReturnParcelController {
  constructor(private returnParcel: ReturnParcelService) {}

  @Patch()
  @HttpCode(200)
  async handle(@Param('id') parcelId: string) {
    const result = await this.returnParcel.execute({ parcelId })

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
