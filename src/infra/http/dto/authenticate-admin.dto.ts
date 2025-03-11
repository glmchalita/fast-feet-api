import { createZodDto } from 'nestjs-zod'
import { z } from 'zod'

import { ApiProperty } from '@nestjs/swagger'

export const AuthenticateAdminSchema = z.object({
  email: z.string().email(),
  password: z.string(),
})

export class AuthenticateAdminRequestDto extends createZodDto(AuthenticateAdminSchema) {
  @ApiProperty({ example: 'admin@example.com', description: 'Admin email address' })
  email: string

  @ApiProperty({ example: 'securepassword', description: 'Admin password' })
  password: string

  constructor(email: string, password: string) {
    super()
    this.email = email
    this.password = password
  }
}

export class AuthenticateAdminResponseDto {
  @ApiProperty({ example: 'eyJhbGciOiJIUzI1NiIsIn...', description: 'JWT access token' })
  access_token: string

  constructor(accessToken: string) {
    this.access_token = accessToken
  }
}
