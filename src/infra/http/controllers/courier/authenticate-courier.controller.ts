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
import { AuthenticateCourierService } from '@/domain/delivery/application/services/courier/authenticate-courier.service'
import { WrongCredentialsError } from '@/core/errors/wrong-credentials-error'
import { Public } from '@/infra/auth/public.decorator'
import { ApiTags } from '@nestjs/swagger'

const authenticateCourierBodySchema = z.object({
  cpf: z.string().length(11),
  password: z.string(),
})

const bodyValidationPipe = new ZodValidationPipe(authenticateCourierBodySchema)

type AuthenticateCourierBodySchema = z.infer<typeof authenticateCourierBodySchema>

@ApiTags('Couriers')
@Controller('/sessions')
@Public()
export class AuthenticateCourierController {
  constructor(private authenticateCourier: AuthenticateCourierService) {}

  @Post()
  @HttpCode(201)
  async handle(@Body(bodyValidationPipe) body: AuthenticateCourierBodySchema) {
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
