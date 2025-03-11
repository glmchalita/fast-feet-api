import {
  ApiBadRequestResponse,
  ApiBody,
  ApiOkResponse,
  ApiOperation,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger'
import { applyDecorators } from '@nestjs/common'
import {
  AuthenticateAdminRequestDto,
  AuthenticateAdminResponseDto,
} from '../http/dto/authenticate-admin.dto'

export function ApiAuthenticateAdmin() {
  return applyDecorators(
    ApiOperation({ summary: 'Authenticate admin credentials' }),
    ApiBody({ type: AuthenticateAdminRequestDto }),
    ApiOkResponse({
      description: 'Admin logged in and access token stored in cache',
      type: AuthenticateAdminResponseDto,
    }),
    ApiUnauthorizedResponse({ description: 'Invalid credentials' }),
    ApiBadRequestResponse({ description: 'Invalid request body' }),
  )
}
