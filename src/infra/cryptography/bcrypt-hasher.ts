import { HashComparator } from '@/domain/delivery/application/cryptography/hash-comparator'
import { HashGenerator } from '@/domain/delivery/application/cryptography/hash-generator'
import { compare, hash } from 'bcryptjs'

export class BcryptHasher implements HashGenerator, HashComparator {
  private HASH_SALT_LENGTH = 8

  async hash(plain: string): Promise<string> {
    return hash(plain, this.HASH_SALT_LENGTH)
  }

  async compare(plain: string, hash: string): Promise<boolean> {
    return compare(plain, hash)
  }
}
