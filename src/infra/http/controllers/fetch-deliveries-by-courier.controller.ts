import { BadRequestException, Controller, Get, HttpCode, Param, Query } from '@nestjs/common'
import { Role } from '@/infra/auth/role.decorator'
import { FetchDeliveriesByCourierService } from '@/domain/delivery/application/services/fetch-deliveries-by-courier.service'
import { z } from 'zod'
import { ZodValidationPipe } from '../pipes/zod-validation-pipe'

const pageQueryParamSchema = z.string().optional().default('1').transform(Number)

const queryValidationPipe = new ZodValidationPipe(pageQueryParamSchema)

type PageQueryParamSchema = z.infer<typeof pageQueryParamSchema>

@Controller('/couriers/:id/deliveries')
@Role('MEMBER')
export class FetchDeliveriesByCourierController {
  constructor(private fetchDeliveriesByCourier: FetchDeliveriesByCourierService) {}

  @Get()
  @HttpCode(200)
  async handle(
    @Param('id') courierId: string,
    @Query('page', queryValidationPipe) page: PageQueryParamSchema,
  ) {
    const result = await this.fetchDeliveriesByCourier.execute({ courierId, page })

    if (result.isLeft()) {
      throw new BadRequestException()
    }

    const parcels = result.value.parcels

    return { parcels }
  }
}
