import { BadRequestException, Controller, Delete, HttpCode, Param } from '@nestjs/common'
import { Role } from '@/infra/auth/role.decorator'
import { DeleteRecipientService } from '@/domain/delivery/application/services/recipient/delete-recipient.service'

@Controller('/recipients/:id')
@Role('ADMIN')
export class DeleteRecipientController {
  constructor(private deleteRecipient: DeleteRecipientService) {}

  @Delete()
  @HttpCode(204)
  async handle(@Param('id') recipientId: string) {
    const result = await this.deleteRecipient.execute({
      recipientId,
    })

    if (result.isLeft()) {
      throw new BadRequestException()
    }
  }
}
