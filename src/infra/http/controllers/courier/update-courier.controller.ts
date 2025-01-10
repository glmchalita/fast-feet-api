import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  Param,
  Put,
  UsePipes,
} from '@nestjs/common'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe'
import { z } from 'zod'
import { UpdateCourierCredentialsService } from '@/domain/delivery/application/services/courier/update-courier-credentials.service'
import { Public } from '@/infra/auth/public'

const updateCourierCredentialsBodySchema = z.object({
  email: z.string().email().optional(),
  password: z.string().optional(),
})

type UpdateCourierCredentialsBodySchema = z.infer<typeof updateCourierCredentialsBodySchema>

@Controller('/couriers/:id')
@Public()
export class UpdateCourierCredentialsController {
  constructor(private updateCourierCredentials: UpdateCourierCredentialsService) {}

  @Put()
  @HttpCode(204)
  @UsePipes(new ZodValidationPipe(updateCourierCredentialsBodySchema))
  async handle(@Body() body: UpdateCourierCredentialsBodySchema, @Param('id') courierId: string) {
    console.log('OIIIIII')
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
