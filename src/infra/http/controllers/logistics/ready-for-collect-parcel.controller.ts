import { BadRequestException, Controller, HttpCode, Param, Patch } from '@nestjs/common'
import { Role } from '@/infra/auth/role.decorator'
import { ReadyForCollectParcelService } from '@/domain/delivery/application/services/logistics/ready-for-collect-parcel.service'

@Controller('/parcels/:id')
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
        default:
          throw new BadRequestException(error.message)
      }
    }
  }
}
