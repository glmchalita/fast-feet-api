import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  Post,
  UnauthorizedException,
  UsePipes,
} from '@nestjs/common'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe'
import { z } from 'zod'
import { Public } from '@/infra/auth/public'
import { AuthenticateCourierService } from '@/domain/delivery/application/services/courier/authenticate-courier.service'
import { WrongCredentialsError } from '@/core/errors/wrong-credentials-error'

const authenticateCourierBodySchema = z.object({
  cpf: z.string().length(11),
  password: z.string(),
})

type AuthenticateCourierBodySchema = z.infer<typeof authenticateCourierBodySchema>

@Controller('/sessions')
@Public()
export class AuthenticateCourierController {
  constructor(private authenticateCourier: AuthenticateCourierService) {}

  @Post()
  @HttpCode(201)
  @UsePipes(new ZodValidationPipe(authenticateCourierBodySchema))
  async handle(@Body() body: AuthenticateCourierBodySchema) {
    const { cpf, password } = body

    const result = await this.authenticateCourier.execute({
      cpf,
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
