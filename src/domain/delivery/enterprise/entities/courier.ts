import { Entity } from '@/core/entities/entity'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'

export interface CourierProps {
  name: string
  email: string
  password: string
}

export class Courier extends Entity<CourierProps> {
  get name() {
    return this.props.name
  }

  get email() {
    return this.props.email
  }

  get password() {
    return this.props.password
  }

  static create(props: CourierProps, id?: UniqueEntityID) {
    const courier = new Courier(props, id)

    return courier
  }
}
