import { BadRequestException, Controller, Delete, HttpCode, Param } from '@nestjs/common'
import { Role } from '@/infra/auth/role.decorator'
import { DeleteParcelService } from '@/domain/delivery/application/services/parcel/delete-parcel.service'

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
      throw new BadRequestException()
    }
  }
}
