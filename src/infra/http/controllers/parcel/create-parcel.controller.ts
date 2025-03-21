import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  NotFoundException,
  Post,
} from '@nestjs/common'
import { z } from 'zod'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe'
import { Role } from '@/infra/auth/role.decorator'
import { CreateParcelService } from '@/domain/delivery/application/services/parcel/create-parcel.service'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'

const createParcelBodySchema = z.object({
  recipientId: z.string().uuid(),
})

type CreateParcelBodySchema = z.infer<typeof createParcelBodySchema>

const bodyValidationPipe = new ZodValidationPipe(createParcelBodySchema)

@Controller('/parcels')
@Role('ADMIN')
export class CreateParcelController {
  constructor(private createParcel: CreateParcelService) {}

  @Post()
  @HttpCode(201)
  async handle(@Body(bodyValidationPipe) body: CreateParcelBodySchema) {
    const { recipientId } = body

    const result = await this.createParcel.execute({ recipientId })

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
