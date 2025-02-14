import { PrismaService } from '../prisma.service'
import { Injectable } from '@nestjs/common'
import { AdminsRepository } from '@/domain/delivery/application/repositories/admin-repository'
import { PrismaAdminMapper } from '../mappers/prisma-admin-mapper'
import { Admin } from '@/domain/delivery/enterprise/entities/admin'

@Injectable()
export class PrismaAdminsRepository implements AdminsRepository {
  constructor(private prisma: PrismaService) {}

  async findByEmail(email: string): Promise<Admin | null> {
    const admin = await this.prisma.user.findUnique({
      where: {
        email,
      },
    })

    if (!admin) return null

    return PrismaAdminMapper.toDomain(admin)
  }
}
