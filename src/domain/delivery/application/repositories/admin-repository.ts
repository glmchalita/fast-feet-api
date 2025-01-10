import { Admin } from '../../enterprise/entities/admin'

export abstract class AdminsRepository {
  abstract findByEmail(email: string): Promise<Admin | null>
}
