import {
  BadRequestException,
  Controller,
  ForbiddenException,
  Get,
  HttpCode,
  NotFoundException,
  Param,
  Query,
} from '@nestjs/common'
import { Role } from '@/infra/auth/role.decorator'
import { FetchDeliveriesByCourierService } from '@/domain/delivery/application/services/fetch-deliveries-by-courier.service'
import { z } from 'zod'
import { ZodValidationPipe } from '../pipes/zod-validation-pipe'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'
import { NotAllowedError } from '@/core/errors/not-allowed-error'
import { ParcelWithRecipientPresenter } from '../presenters/parcel-with-recipient-presenter'

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
      const error = result.value

      switch (error.constructor) {
        case ResourceNotFoundError:
          throw new NotFoundException(error.message)
        case NotAllowedError:
          throw new ForbiddenException(error.message)
        default:
          throw new BadRequestException(error.message)
      }
    }

    const parcels = result.value.parcels

    return { parcels: parcels.map(ParcelWithRecipientPresenter.toHTTP) }
  }
}
