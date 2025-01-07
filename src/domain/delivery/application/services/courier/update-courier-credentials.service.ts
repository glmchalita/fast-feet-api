import { Either, left, right } from '@/core/either'
import { Injectable } from '@nestjs/common'
import { CouriersRepository } from '../../repositories/couriers-repository'
import { HashGenerator } from '../../cryptography/hash-generator'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'

interface UpdateCourierCredentialsServiceRequest {
  courierId: string
  email?: string | null
  password?: string | null
}

type UpdateCourierCredentialsServiceResponse = Either<ResourceNotFoundError, null>

@Injectable()
export class UpdateCourierCredentialsService {
  constructor(
    private couriersRepository: CouriersRepository,
    private hashGenerator: HashGenerator,
  ) {}

  async execute({
    courierId,
    email,
    password,
  }: UpdateCourierCredentialsServiceRequest): Promise<UpdateCourierCredentialsServiceResponse> {
    const courier = await this.couriersRepository.findById(courierId)

    if (!courier) return left(new ResourceNotFoundError())

    if (password && password !== null) {
      const hashedPassword = await this.hashGenerator.hash(password)
      courier.password = hashedPassword
    }

    if (email && email !== null) {
      courier.email = email
    }

    await this.couriersRepository.save(courier)

    return right(null)
  }
}
