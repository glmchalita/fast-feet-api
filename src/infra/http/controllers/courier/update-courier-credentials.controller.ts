import { BadRequestException, Body, Controller, HttpCode, Param, Put } from '@nestjs/common'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe'
import { z } from 'zod'
import { UpdateCourierCredentialsService } from '@/domain/delivery/application/services/courier/update-courier-credentials.service'
import { Role } from '@/infra/auth/role.decorator'

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
    console.log(`BODY: ${body}`)
    const { email, password } = body

    const result = await this.updateCourierCredentials.execute({
      courierId,
      email,
      password,
    })

    if (result.isLeft()) {
      throw new BadRequestException()
    }
  }
}
