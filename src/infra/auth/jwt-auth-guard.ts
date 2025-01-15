import { ExecutionContext, Injectable } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { AuthGuard } from '@nestjs/passport'
import { Role } from '@prisma/client'
import { ROLE_KEY } from './role.decorator'
import { IS_PUBLIC_KEY } from './public.decorator'

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super()
  }

  async canActivate(context: ExecutionContext) {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ])

    if (isPublic) {
      return true
    }

    const isAuthenticated = await super.canActivate(context)

    if (!isAuthenticated) {
      return false
    }

    const requiredRole = this.reflector.getAllAndOverride<Role>(ROLE_KEY, [
      context.getHandler(),
      context.getClass(),
    ])

    if (!requiredRole) {
      return true
    }

    const { user } = context.switchToHttp().getRequest()

    return user.role === requiredRole
  }
}
