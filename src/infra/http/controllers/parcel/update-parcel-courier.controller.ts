import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  NotFoundException,
  Param,
  Put,
} from '@nestjs/common'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe'
import { z } from 'zod'
import { Role } from '@/infra/auth/role.decorator'
import { UpdateParcelCourierService } from '@/domain/delivery/application/services/parcel/update-parcel-courier.service'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'
import { ApiTags } from '@nestjs/swagger'

const updateParcelCourierBodySchema = z.object({
  courierId: z.string().uuid(),
})

const bodyValidationPipe = new ZodValidationPipe(updateParcelCourierBodySchema)

type UpdateParcelCourierBodySchema = z.infer<typeof updateParcelCourierBodySchema>

@ApiTags('Parcels')
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
