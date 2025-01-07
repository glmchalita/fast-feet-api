import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Address } from '../value-objects/address'
import { Entity } from '@/core/entities/entity'

export interface RecipientProps {
  name: string
  cpf: string
  email: string
  address: Address
}

export class Recipient extends Entity<RecipientProps> {
  get name() {
    return this.props.name
  }

  get cpf() {
    return this.props.cpf
  }

  get email() {
    return this.props.email
  }

  get address() {
    return this.props.address
  }

  set address(address: Address) {
    this.props.address = address
  }

  static create(props: RecipientProps, id?: UniqueEntityID) {
    const recipient = new Recipient(
      {
        ...props,
        address: Address.create({
          state: props.address.state ?? null,
          city: props.address.city,
          zipCode: props.address.zipCode,
          streetAddress: props.address.streetAddress,
          neighborhood: props.address.neighborhood,
          latitude: props.address.latitude,
          longitude: props.address.longitude,
        }),
      },
      id,
    )

    return recipient
  }
}
