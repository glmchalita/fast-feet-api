import {
  BadRequestException,
  Body,
  ConflictException,
  Controller,
  HttpCode,
  Post,
  UsePipes,
} from '@nestjs/common'
import { z } from 'zod'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe'

import { Public } from '@/infra/auth/public'
import { CreateCourierService } from '@/domain/delivery/application/services/courier/create-courier.service'
import { CourierAlreadyExistsError } from '@/core/errors/courier-already-exists-error'

const createCourierBodySchema = z.object({
  name: z.string(),
  cpf: z.string().length(11),
  email: z.string().email(),
  password: z.string(),
})

type CreateCourierBodySchema = z.infer<typeof createCourierBodySchema>

@Controller('/accounts')
@Public()
export class CreateCourierController {
  constructor(private createCourier: CreateCourierService) {}

  @Post()
  @HttpCode(201)
  @UsePipes(new ZodValidationPipe(createCourierBodySchema))
  async handle(@Body() body: CreateCourierBodySchema) {
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
