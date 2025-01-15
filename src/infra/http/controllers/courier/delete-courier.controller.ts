import { BadRequestException, Controller, Delete, HttpCode, Param } from '@nestjs/common'
import { DeleteCourierService } from '@/domain/delivery/application/services/courier/delete-courier.service'
import { Role } from '@/infra/auth/role.decorator'

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
      throw new BadRequestException()
    }
  }
}
