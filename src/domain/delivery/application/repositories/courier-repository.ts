import { Courier } from '../../enterprise/entities/courier'

export abstract class CourierRepository {
  abstract create(courier: Courier): Promise<void>
  abstract findByEmail(email: string): Promise<Courier | null>
}
