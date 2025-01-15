import { Either, left, right } from '@/core/either'
import { Encrypter } from '../../cryptography/encrypter'
import { WrongCredentialsError } from '@/core/errors/wrong-credentials-error'
import { Injectable } from '@nestjs/common'
import { AdminsRepository } from '../../repositories/admin-repository'

interface AuthenticateAdminServiceRequest {
  email: string
  password: string
}

type AuthenticateAdminServiceResponse = Either<
  WrongCredentialsError,
  {
    accessToken: string
  }
>

@Injectable()
export class AuthenticateAdminService {
  constructor(
    private adminsRepository: AdminsRepository,
    private encrypter: Encrypter,
  ) {}

  async execute({
    email,
    password,
  }: AuthenticateAdminServiceRequest): Promise<AuthenticateAdminServiceResponse> {
    const admin = await this.adminsRepository.findByEmail(email)

    if (!admin) {
      return left(new WrongCredentialsError())
    }

    const isPasswordValid = password === admin.password

    if (!isPasswordValid) {
      return left(new WrongCredentialsError())
    }

    const accessToken = await this.encrypter.encrypt({
      sub: admin.id.toString(),
    })

    return right({ accessToken })
  }
}
