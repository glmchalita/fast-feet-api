import { Either, left, right } from '@/core/either'
import { CouriersRepository } from '../../repositories/couriers-repository'
import { HashComparator } from '../../cryptography/hash-comparator'
import { Encrypter } from '../../cryptography/encrypter'
import { WrongCredentialsError } from '@/core/errors/wrong-credentials-error'

interface AuthenticateCourierServiceRequest {
  cpf: string
  password: string
}

type AuthenticateCourierServiceResponse = Either<
  WrongCredentialsError,
  {
    accessToken: string
  }
>

export class AuthenticateCourierService {
  constructor(
    private couriersRepository: CouriersRepository,
    private hashComparator: HashComparator,
    private encrypter: Encrypter,
  ) {}

  async execute({
    cpf,
    password,
  }: AuthenticateCourierServiceRequest): Promise<AuthenticateCourierServiceResponse> {
    const courier = await this.couriersRepository.findByCpf(cpf)

    if (!courier) {
      return left(new WrongCredentialsError())
    }

    const isPasswordValid = await this.hashComparator.compare(password, courier.password)

    if (!isPasswordValid) {
      return left(new WrongCredentialsError())
    }

    const accessToken = await this.encrypter.encrypt({
      sub: courier.id.toString(),
    })

    return right({ accessToken })
  }
}
