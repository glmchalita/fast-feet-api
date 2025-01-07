import { Either, left, right } from '@/core/either'
import { Injectable } from '@nestjs/common'
import { CouriersRepository } from '../../repositories/couriers-repository'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'

interface DeleteCourierServiceRequest {
  courierId: string
}

type DeleteCourierServiceResponse = Either<ResourceNotFoundError, null>

@Injectable()
export class DeleteCourierService {
  constructor(private couriersRepository: CouriersRepository) {}

  async execute({ courierId }: DeleteCourierServiceRequest): Promise<DeleteCourierServiceResponse> {
    const courier = await this.couriersRepository.findById(courierId)

    if (!courier) return left(new ResourceNotFoundError())

    await this.couriersRepository.delete(courier)

    return right(null)
  }
}
