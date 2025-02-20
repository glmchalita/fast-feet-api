import { PrismaService } from '../prisma.service'
import { Injectable } from '@nestjs/common'
import {
  FindManyNearbyParams,
  ParcelsRepository,
} from '@/domain/delivery/application/repositories/parcels-repository'
import { PaginationParams } from '@/core/repositories/pagination-params'
import { Parcel } from '@/domain/delivery/enterprise/entities/parcel'
import { PrismaParcelMapper } from '../mappers/prisma-parcel-mapper'
import { ParcelAttachmentRepository } from '@/domain/delivery/application/repositories/parcel-attachment-repository'

@Injectable()
export class PrismaParcelsRepository implements ParcelsRepository {
  constructor(
    private prisma: PrismaService,
    private parcelAttachmentRepository: ParcelAttachmentRepository,
  ) {}

  async create(parcel: Parcel): Promise<void> {
    const data = PrismaParcelMapper.toPrisma(parcel)

    const createdParcel = await this.prisma.parcel.create({
      data,
    })

    await this.prisma.statusHistory.create({
      data: {
        parcelId: createdParcel.id,
        status: createdParcel.currentStatus,
        date: new Date(),
      },
    })
  }

  async delete(parcel: Parcel): Promise<void> {
    const data = PrismaParcelMapper.toPrisma(parcel)

    await this.prisma.parcel.delete({
      where: { id: data.id },
    })
  }

  async save(parcel: Parcel): Promise<void> {
    const data = PrismaParcelMapper.toPrisma(parcel)

    const updatedParcel = await this.prisma.parcel.update({
      where: {
        id: parcel.id.toString(),
      },
      data,
    })

    const statusExists = await this.prisma.statusHistory.findFirst({
      where: {
        parcelId: updatedParcel.id,
        status: updatedParcel.currentStatus,
      },
    })

    if (!statusExists) {
      await this.prisma.statusHistory.create({
        data: {
          parcelId: updatedParcel.id,
          status: updatedParcel.currentStatus,
          date: new Date(),
        },
      })
    }

    if (parcel.attachment) {
      await this.parcelAttachmentRepository.create(parcel.attachment)
    }
  }

  async findById(id: string): Promise<Parcel | null> {
    const parcel = await this.prisma.parcel.findUnique({
      where: {
        id,
      },
      include: {
        statusHistory: true,
      },
    })

    if (!parcel) return null

    return PrismaParcelMapper.toDomain(parcel)
  }

  async findManyByCourierId(courierId: string, { page }: PaginationParams): Promise<Parcel[]> {
    const parcels = await this.prisma.parcel.findMany({
      where: {
        courierId,
      },
      include: {
        statusHistory: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 20,
      skip: (page - 1) * 20,
    })

    return parcels.map(PrismaParcelMapper.toDomain)
  }

  async findManyNearby(
    { latitude, longitude }: FindManyNearbyParams,
    { page }: PaginationParams,
  ): Promise<Parcel[]> {
    const parcels = await this.prisma.$queryRaw<Parcel[]>`
    SELECT parcels.* 
    FROM parcels
    INNER JOIN recipients ON parcels.recipient_id = recipients.id
    WHERE ( 6371 * acos( 
      cos( radians(${latitude}) ) * cos( radians( recipients.latitude ) ) * 
      cos( radians( recipients.longitude ) - radians(${longitude}) ) + 
      sin( radians(${latitude}) ) * sin( radians( recipients.latitude ) ) 
    ) ) <= 10
    LIMIT 20
    OFFSET ${(page - 1) * 20}
    `

    return parcels
  }
}
