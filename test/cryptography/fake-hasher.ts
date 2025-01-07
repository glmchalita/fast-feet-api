import { HashComparator } from '@/domain/delivery/application/cryptography/hash-comparator'
import { HashGenerator } from '@/domain/delivery/application/cryptography/hash-generator'

export class FakeHasher implements HashGenerator, HashComparator {
  async hash(plain: string): Promise<string> {
    return plain.concat('-hashed')
  }

  async compare(plain: string, hash: string): Promise<boolean> {
    return plain.concat('-hashed') === hash
  }
}
