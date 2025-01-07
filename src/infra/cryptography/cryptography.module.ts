import { Module } from '@nestjs/common'
import { JwtEncrypter } from './jwt-encrypter'
import { BcryptHasher } from './bcrypt-hasher'
import { Encrypter } from '@/domain/delivery/application/cryptography/encrypter'
import { HashComparator } from '@/domain/delivery/application/cryptography/hash-comparator'
import { HashGenerator } from '@/domain/delivery/application/cryptography/hash-generator'

@Module({
  providers: [
    { provide: Encrypter, useClass: JwtEncrypter },
    { provide: HashComparator, useClass: BcryptHasher },
    { provide: HashGenerator, useClass: BcryptHasher },
  ],
  exports: [Encrypter, HashComparator, HashGenerator],
})
export class CryptographyModule {}
