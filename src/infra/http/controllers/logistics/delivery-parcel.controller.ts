import {
  BadRequestException,
  Body,
  ConflictException,
  Controller,
  HttpCode,
  NotFoundException,
  Param,
  Patch,
} from '@nestjs/common'
import { z } from 'zod'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe'
import { Role } from '@/infra/auth/role.decorator'
import { ParcelNotAvailableError } from '@/core/errors/parcel-not-available-error'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'
import { DeliveryParcelService } from '@/domain/delivery/application/services/logistics/delivery-parcel.service'
import { ApiTags } from '@nestjs/swagger'

const deliveryParcelBodySchema = z.object({
  attachmentId: z.string().uuid(),
})

type DeliveryParcelBodySchema = z.infer<typeof deliveryParcelBodySchema>

const bodyValidationPipe = new ZodValidationPipe(deliveryParcelBodySchema)

@ApiTags('Logistics')
@Controller('/parcels/:id/delivery')
@Role('MEMBER')
export class DeliveryParcelController {
  constructor(private deliveryParcel: DeliveryParcelService) {}

  @Patch()
  @HttpCode(200)
  async handle(
    @Param('id') parcelId: string,
    @Body(bodyValidationPipe) body: DeliveryParcelBodySchema,
  ) {
    const { attachmentId } = body

    const result = await this.deliveryParcel.execute({ parcelId, attachmentId })

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
