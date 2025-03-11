import {
  BadRequestException,
  Controller,
  Delete,
  HttpCode,
  NotFoundException,
  Param,
} from '@nestjs/common'
import { DeleteCourierService } from '@/domain/delivery/application/services/courier/delete-courier.service'
import { Role } from '@/infra/auth/role.decorator'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'
import { ApiTags } from '@nestjs/swagger'

@ApiTags('Couriers')
@Controller('/couriers/:id')
@Role('ADMIN')
export class DeleteCourierController {
  constructor(private deleteCourier: DeleteCourierService) {}

  @Delete()
  @HttpCode(204)
  async handle(@Param('id') courierId: string) {
    const result = await this.deleteCourier.execute({
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
