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
import { ParcelWithRecipient } from '@/domain/delivery/enterprise/value-objects/parcel-with-recipient'
import { PrismaParcelWithRecipientMapper } from '../mappers/prisma-parcel-with-recipient-mapper'
import { Status } from '@prisma/client'
import { Decimal } from '@prisma/client/runtime/library'
import { DomainEvents } from '@/core/events/domain-events'
import { CacheRepository } from '@/infra/cache/cache-repository'

@Injectable()
export class PrismaParcelsRepository implements ParcelsRepository {
  constructor(
    private prisma: PrismaService,
    private cache: CacheRepository,
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

    DomainEvents.dispatchEventsForAggregate(parcel.id)
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

    DomainEvents.dispatchEventsForAggregate(parcel.id)

    this.cache.delete(`parcels:${data.courierId}:deliveries`)
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

  async findManyByCourierIdWithRecipient(
    courierId: string,
    { page }: PaginationParams,
  ): Promise<ParcelWithRecipient[]> {
    const cacheHit = await this.cache.get(`parcels:${courierId}:deliveries`)

    if (cacheHit) {
      const cachedData = JSON.parse(cacheHit)

      return cachedData.map(PrismaParcelWithRecipientMapper.toDomain)
    }

    const parcels = await this.prisma.parcel.findMany({
      where: {
        courierId,
      },
      include: {
        recipient: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 20,
      skip: (page - 1) * 20,
    })

    await this.cache.set(`parcels:${courierId}:deliveries`, JSON.stringify(parcels))

    return parcels.map(PrismaParcelWithRecipientMapper.toDomain)
  }

  async findManyNearbyWithRecipient(
    { latitude, longitude }: FindManyNearbyParams,
    { page }: PaginationParams,
  ): Promise<ParcelWithRecipient[]> {
    const parcelsRaw = await this.prisma.$queryRaw<
      Array<{
        parcelId: string
        courierId: string | null
        trackingNumber: string
        currentStatus: string
        createdAt: Date
        updatedAt: Date | null
        recipientId: string
        recipientName: string
        recipientEmail: string
        recipientCpf: string
        recipientState: string
        recipientCity: string
        recipientZipCode: string
        recipientStreetAddress: string
        recipientNeighborhood: string
        recipientLatitude: Decimal
        recipientLongitude: Decimal
      }>
    >`
    SELECT 
      parcels.id as "parcelId",
      parcels.courier_id as "courierId",
      parcels.tracking_number as "trackingNumber",
      parcels.current_status as "currentStatus",
      parcels.created_at as "createdAt",
      parcels.updated_at as "updatedAt",
      recipients.id as "recipientId",
      recipients.email as "recipientEmail",
      recipients.name as "recipientName",
      recipients.cpf as "recipientCpf",
      recipients.state as "recipientState",
      recipients.city as "recipientCity",
      recipients.zip_code as "recipientZipCode",
      recipients.street_address as "recipientStreetAddress",
      recipients.neighborhood as "recipientNeighborhood",
      recipients.latitude as "recipientLatitude",
      recipients.longitude as "recipientLongitude"
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

    return parcelsRaw.map((raw) =>
      PrismaParcelWithRecipientMapper.toDomain({
        id: raw.parcelId,
        courierId: raw.courierId,
        trackingNumber: raw.trackingNumber,
        currentStatus: raw.currentStatus as Status,
        createdAt: raw.createdAt,
        updatedAt: raw.updatedAt,
        recipientId: raw.recipientId,
        recipient: {
          id: raw.recipientId,
          name: raw.recipientName,
          email: raw.recipientEmail,
          cpf: raw.recipientCpf,
          state: raw.recipientState,
          city: raw.recipientCity,
          zipCode: raw.recipientZipCode,
          streetAddress: raw.recipientStreetAddress,
          neighborhood: raw.recipientNeighborhood,
          latitude: raw.recipientLatitude,
          longitude: raw.recipientLongitude,
        },
      }),
    )
  }
}
