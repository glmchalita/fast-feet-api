import { BadRequestException, Body, Controller, Get, HttpCode, Query } from '@nestjs/common'
import { z } from 'zod'
import { Role } from '@/infra/auth/role.decorator'
import { ZodValidationPipe } from '../pipes/zod-validation-pipe'
import { FetchNearbyDeliveriesService } from '@/domain/delivery/application/services/fetch-nearby-deliveries'

const fetchNearbyDeliveriesBodySchema = z.object({
  latitude: z.number().refine((value) => {
    return Math.abs(value) <= 90
  }),
  longitude: z.number().refine((value) => {
    return Math.abs(value) <= 180
  }),
})

const bodyValidationPipe = new ZodValidationPipe(fetchNearbyDeliveriesBodySchema)

type FetchNearbyDeliveriesBodySchema = z.infer<typeof fetchNearbyDeliveriesBodySchema>

const pageQueryParamSchema = z
  .string()
  .optional()
  .default('1')
  .transform(Number)
  .pipe(z.number().min(1))

const queryValidationPipe = new ZodValidationPipe(pageQueryParamSchema)

type PageQueryParamSchema = z.infer<typeof pageQueryParamSchema>

@Controller('/parcels/nearby')
@Role('MEMBER')
export class FetchNearbyDeliveriesController {
  constructor(private fetchNearbyDeliveries: FetchNearbyDeliveriesService) {}

  @Get()
  @HttpCode(200)
  async handle(
    @Body(bodyValidationPipe) body: FetchNearbyDeliveriesBodySchema,
    @Query('page', queryValidationPipe) page: PageQueryParamSchema,
  ) {
    const { latitude, longitude } = body

    const result = await this.fetchNearbyDeliveries.execute({
      courierLatitude: latitude,
      courierLongitude: longitude,
      page,
    })

    if (result.isLeft()) {
      throw new BadRequestException()
    }

    const parcels = result.value.parcels

    return { parcels }
  }
}
