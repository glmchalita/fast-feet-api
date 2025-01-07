import { Either, left, right } from '@/core/either'
import { Injectable } from '@nestjs/common'
import { CouriersRepository } from '../../repositories/couriers-repository'
import { CourierAlreadyExistsError } from '@/core/errors/courier-already-exists-error'
import { HashGenerator } from '../../cryptography/hash-generator'
import { Courier } from '@/domain/delivery/enterprise/entities/courier'

interface CreateCourierServiceRequest {
  name: string
  cpf: string
  email: string
  password: string
  latitude: number
  longitude: number
}

type CreateCourierServiceResponse = Either<
  CourierAlreadyExistsError,
  {
    courier: Courier
  }
>

@Injectable()
export class CreateCourierService {
  constructor(
    private couriersRepository: CouriersRepository,
    private hashGenerator: HashGenerator,
  ) {}

  async execute({
    name,
    cpf,
    email,
    password,
    latitude,
    longitude,
  }: CreateCourierServiceRequest): Promise<CreateCourierServiceResponse> {
    const courierWithSameCpf = await this.couriersRepository.findByCpf(cpf)
    if (courierWithSameCpf) {
      return left(new CourierAlreadyExistsError(cpf))
    }

    const courierWithSameEmail = await this.couriersRepository.findByEmail(email)
    if (courierWithSameEmail) {
      return left(new CourierAlreadyExistsError(email))
    }

    const hashedPassword = await this.hashGenerator.hash(password)

    const courier = Courier.create({
      name,
      cpf,
      email,
      password: hashedPassword,
      latitude,
      longitude,
    })

    await this.couriersRepository.create(courier)

    return right({ courier })
  }
}
