import { SetMetadata } from '@nestjs/common'
import { Role as PrismaRole } from '@prisma/client'

export const ROLE_KEY = 'role'
export const Role = (role: PrismaRole) => SetMetadata(ROLE_KEY, role)
