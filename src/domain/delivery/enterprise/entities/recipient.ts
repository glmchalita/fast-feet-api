import { Entity } from '@/core/entities/entity'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'

export interface RecipientProps {
  name: string
  state: string
  city: string
  zipCode: string
  streetAddress: string
  neighborhood: string
}

export class Recipient extends Entity<RecipientProps> {
  get name() {
    return this.props.name
  }

  get state() {
    return this.props.state
  }

  get city() {
    return this.props.city
  }

  get zipCode() {
    return this.props.zipCode
  }

  get streetAddress() {
    return this.props.streetAddress
  }

  get neighborhood() {
    return this.props.neighborhood
  }

  static create(props: RecipientProps, id?: UniqueEntityID) {
    const recipient = new Recipient(props, id)

    return recipient
  }
}
