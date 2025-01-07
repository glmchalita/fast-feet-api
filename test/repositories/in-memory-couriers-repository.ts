import { CouriersRepository } from '@/domain/delivery/application/repositories/couriers-repository'
import { Courier } from '@/domain/delivery/enterprise/entities/courier'

export class InMemoryCouriersRepository implements CouriersRepository {
  public items: Courier[] = []

  async create(courier: Courier) {
    this.items.push(courier)
  }

  async delete(courier: Courier) {
    const itemIndex = this.items.findIndex((item) => item.id === courier.id)

    this.items.splice(itemIndex, 1)
  }

  async save(courier: Courier) {
    const itemIndex = this.items.findIndex((item) => item.id === courier.id)

    this.items[itemIndex] = courier
  }

  async findByCpf(cpf: string) {
    const courier = this.items.find((item) => item.cpf === cpf)

    if (!courier) return null

    return courier
  }

  async findByEmail(email: string) {
    const courier = this.items.find((item) => item.email === email)

    if (!courier) return null

    return courier
  }

  async findById(id: string) {
    const courier = this.items.find((item) => item.id.toString() === id)

    if (!courier) return null

    return courier
  }

  async findByVehicleLicensePlate(licensePlate: string) {
    const courier = this.items.find((item) => item.vehicle?.licensePlate === licensePlate)

    if (!courier) return null

    return courier
  }
}
