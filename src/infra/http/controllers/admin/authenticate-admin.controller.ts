import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  Post,
  UnauthorizedException,
} from '@nestjs/common'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe'
import { z } from 'zod'
import { WrongCredentialsError } from '@/core/errors/wrong-credentials-error'
import { AuthenticateAdminService } from '@/domain/delivery/application/services/admin/authenticate-admin.service'
import { Public } from '@/infra/auth/public.decorator'

const authenticateAdminBodySchema = z.object({
  email: z.string().email(),
  password: z.string(),
})

const bodyValidationPipe = new ZodValidationPipe(authenticateAdminBodySchema)

type AuthenticateAdminBodySchema = z.infer<typeof authenticateAdminBodySchema>

@Controller('/sessions/admin')
@Public()
export class AuthenticateAdminController {
  constructor(private authenticateAdmin: AuthenticateAdminService) {}

  @Post()
  @HttpCode(201)
  async handle(@Body(bodyValidationPipe) body: AuthenticateAdminBodySchema) {
    const { email, password } = body

    const result = await this.authenticateAdmin.execute({
      email,
      password,
    })

    if (result.isLeft()) {
      const error = result.value

      switch (error.constructor) {
        case WrongCredentialsError:
          throw new UnauthorizedException(error.message)
        default:
          throw new BadRequestException(error.message)
      }
    }

    const { accessToken } = result.value

    return {
      access_token: accessToken,
    }
  }
}
