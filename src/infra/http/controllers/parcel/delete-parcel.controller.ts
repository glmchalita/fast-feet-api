import {
  BadRequestException,
  Controller,
  Delete,
  HttpCode,
  NotFoundException,
  Param,
} from '@nestjs/common'
import { Role } from '@/infra/auth/role.decorator'
import { DeleteParcelService } from '@/domain/delivery/application/services/parcel/delete-parcel.service'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'

@Controller('/parcels/:id')
@Role('ADMIN')
export class DeleteParcelController {
  constructor(private deleteParcel: DeleteParcelService) {}

  @Delete()
  @HttpCode(204)
  async handle(@Param('id') parcelId: string) {
    const result = await this.deleteParcel.execute({
      parcelId,
    })

    if (result.isLeft()) {
      const error = result.value

      switch (error.constructor) {
        case ResourceNotFoundError:
          throw new NotFoundException(error.message)
        default:
          throw new BadRequestException(error.message)
      }
    }
  }
}
