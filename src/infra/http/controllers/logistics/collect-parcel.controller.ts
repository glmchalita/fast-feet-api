import {
  BadRequestException,
  Body,
  ConflictException,
  Controller,
  HttpCode,
  Param,
  Patch,
} from '@nestjs/common'
import { z } from 'zod'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe'
import { Role } from '@/infra/auth/role.decorator'
import { CollectParcelService } from '@/domain/delivery/application/services/logistics/collect-parcel.service'
import { ParcelNotAvailableError } from '@/core/errors/parcel-not-available-error'

const collectParcelBodySchema = z.object({
  courierId: z.string().uuid(),
})

type CollectParcelBodySchema = z.infer<typeof collectParcelBodySchema>

const bodyValidationPipe = new ZodValidationPipe(collectParcelBodySchema)

@Controller('/parcels/:id')
@Role('MEMBER')
export class CollectParcelController {
  constructor(private collectParcel: CollectParcelService) {}

  @Patch()
  @HttpCode(200)
  async handle(
    @Param('id') parcelId: string,
    @Body(bodyValidationPipe) body: CollectParcelBodySchema,
  ) {
    const { courierId } = body

    const result = await this.collectParcel.execute({ parcelId, courierId })

    if (result.isLeft()) {
      const error = result.value

      switch (error.constructor) {
        case ParcelNotAvailableError:
          throw new ConflictException(error.message)
        default:
          throw new BadRequestException(error.message)
      }
    }
  }
}
