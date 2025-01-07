import { RecipientsRepository } from '@/domain/delivery/application/repositories/recipients-repository'
import { Recipient } from '@/domain/delivery/enterprise/entities/recipient'

export class InMemoryRecipientsRepository implements RecipientsRepository {
  public items: Recipient[] = []

  async create(recipient: Recipient) {
    this.items.push(recipient)
  }

  async delete(recipient: Recipient) {
    const itemIndex = this.items.findIndex((item) => item.id === recipient.id)

    this.items.splice(itemIndex, 1)
  }

  async save(recipient: Recipient) {
    const itemIndex = this.items.findIndex((item) => item.id === recipient.id)

    this.items[itemIndex] = recipient
  }

  async findByCpf(cpf: string) {
    const recipient = this.items.find((item) => item.cpf === cpf)

    if (!recipient) return null

    return recipient
  }

  async findById(id: string) {
    const recipient = this.items.find((item) => item.id.toString() === id)

    if (!recipient) return null

    return recipient
  }
}
