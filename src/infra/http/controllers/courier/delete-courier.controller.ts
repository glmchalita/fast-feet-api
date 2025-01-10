import { BadRequestException, Controller, Delete, HttpCode, Param } from '@nestjs/common'
import { Public } from '@/infra/auth/public'
import { DeleteCourierService } from '@/domain/delivery/application/services/courier/delete-courier.service'

@Controller('/couriers/:id')
@Public()
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
