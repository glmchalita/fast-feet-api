import {
  BadRequestException,
  Body,
  ConflictException,
  Controller,
  HttpCode,
  Post,
} from '@nestjs/common'
import { z } from 'zod'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe'
import { CreateCourierService } from '@/domain/delivery/application/services/courier/create-courier.service'
import { CourierAlreadyExistsError } from '@/core/errors/courier-already-exists-error'
import { Role } from '@/infra/auth/role.decorator'
import { ApiTags } from '@nestjs/swagger'

const createCourierBodySchema = z.object({
  name: z.string(),
  cpf: z.string().length(11),
  email: z.string().email(),
  password: z.string(),
})

type CreateCourierBodySchema = z.infer<typeof createCourierBodySchema>

const bodyValidationPipe = new ZodValidationPipe(createCourierBodySchema)

@ApiTags('Couriers')
@Controller('/couriers')
@Role('ADMIN')
export class CreateCourierController {
  constructor(private createCourier: CreateCourierService) {}

  @Post()
  @HttpCode(201)
  async handle(@Body(bodyValidationPipe) body: CreateCourierBodySchema) {
    const { name, cpf, email, password } = body

    const result = await this.createCourier.execute({ name, cpf, email, password })

    if (result.isLeft()) {
      const error = result.value

      switch (error.constructor) {
        case CourierAlreadyExistsError:
          throw new ConflictException(error.message)
        default:
          throw new BadRequestException(error.message)
      }
    }
  }
}
