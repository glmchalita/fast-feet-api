import { BadRequestException, Controller, HttpCode, Param, Patch } from '@nestjs/common'
import { Role } from '@/infra/auth/role.decorator'
import { OutForDeliveryParcelService } from '@/domain/delivery/application/services/logistics/out-for-delivery-parcel.service'

@Controller('/parcels/:id')
@Role('ADMIN')
export class OutForDeliveryParcelController {
  constructor(private outForDeliveryParcel: OutForDeliveryParcelService) {}

  @Patch()
  @HttpCode(200)
  async handle(@Param('id') parcelId: string) {
    const result = await this.outForDeliveryParcel.execute({ parcelId })

    if (result.isLeft()) {
      const error = result.value

      switch (error.constructor) {
        default:
          throw new BadRequestException(error.message)
      }
    }
  }
}
