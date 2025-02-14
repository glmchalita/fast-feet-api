import { BadRequestException, Controller, HttpCode, Param, Patch } from '@nestjs/common'
import { Role } from '@/infra/auth/role.decorator'
import { ReturnParcelService } from '@/domain/delivery/application/services/logistics/return-parcel.service'

@Controller('/parcels/:id')
@Role('ADMIN')
export class ReturnParcelController {
  constructor(private returnParcel: ReturnParcelService) {}

  @Patch()
  @HttpCode(200)
  async handle(@Param('id') parcelId: string) {
    const result = await this.returnParcel.execute({ parcelId })

    if (result.isLeft()) {
      const error = result.value

      switch (error.constructor) {
        default:
          throw new BadRequestException(error.message)
      }
    }
  }
}
