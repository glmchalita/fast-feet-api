import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  NotFoundException,
  Param,
  Put,
} from '@nestjs/common'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe'
import { z } from 'zod'
import { UpdateCourierCredentialsService } from '@/domain/delivery/application/services/courier/update-courier-credentials.service'
import { Role } from '@/infra/auth/role.decorator'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'

const updateCourierCredentialsBodySchema = z.object({
  email: z.string().email().optional(),
  password: z.string().optional(),
})

const bodyValidationPipe = new ZodValidationPipe(updateCourierCredentialsBodySchema)

type UpdateCourierCredentialsBodySchema = z.infer<typeof updateCourierCredentialsBodySchema>

@Controller('/couriers/:id')
@Role('ADMIN')
export class UpdateCourierCredentialsController {
  constructor(private updateCourierCredentials: UpdateCourierCredentialsService) {}

  @Put()
  @HttpCode(204)
  async handle(
    @Body(bodyValidationPipe) body: UpdateCourierCredentialsBodySchema,
    @Param('id') courierId: string,
  ) {
    const { email, password } = body

    const result = await this.updateCourierCredentials.execute({
      courierId,
      email,
      password,
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
