import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  Post,
  UnauthorizedException,
} from '@nestjs/common'
import { WrongCredentialsError } from '@/core/errors/wrong-credentials-error'
import { AuthenticateAdminService } from '@/domain/delivery/application/services/admin/authenticate-admin.service'
import { Public } from '@/infra/auth/public.decorator'
import { ApiTags } from '@nestjs/swagger'
import { ApiAuthenticateAdmin } from '@/infra/swagger/authenticate-admin.swagger'
import {
  AuthenticateAdminRequestDto,
  AuthenticateAdminResponseDto,
} from '../../dto/authenticate-admin.dto'

@Controller('/sessions/admin')
@ApiTags('Admin')
@Public()
export class AuthenticateAdminController {
  constructor(private authenticateAdmin: AuthenticateAdminService) {}

  @ApiAuthenticateAdmin()
  @Post()
  @HttpCode(201)
  async handle(@Body() body: AuthenticateAdminRequestDto) {
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

    return new AuthenticateAdminResponseDto(accessToken)
  }
}
