import { BadRequestException, Body, Controller, HttpCode, Param, Put } from '@nestjs/common'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe'
import { z } from 'zod'
import { Role } from '@/infra/auth/role.decorator'
import { UpdateParcelCourierService } from '@/domain/delivery/application/services/parcel/update-parcel-courier.service'

const updateParcelCourierBodySchema = z.object({
  courierId: z.string().uuid(),
})

const bodyValidationPipe = new ZodValidationPipe(updateParcelCourierBodySchema)

type UpdateParcelCourierBodySchema = z.infer<typeof updateParcelCourierBodySchema>

@Controller('/parcels/:id')
@Role('ADMIN')
export class UpdateParcelCourierController {
  constructor(private updateParcelCourier: UpdateParcelCourierService) {}

  @Put()
  @HttpCode(204)
  async handle(
    @Body(bodyValidationPipe) body: UpdateParcelCourierBodySchema,
    @Param('id') parcelId: string,
  ) {
    const { courierId } = body

    const result = await this.updateParcelCourier.execute({
      parcelId,
      courierId,
    })

    if (result.isLeft()) {
      throw new BadRequestException()
    }
  }
}
