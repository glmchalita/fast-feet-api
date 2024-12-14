import { Entity } from '@/core/entities/entity'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'

export interface AdminProps {
  email: string
  password: string
}

export class Admin extends Entity<AdminProps> {
  get email() {
    return this.props.email
  }

  get password() {
    return this.props.password
  }

  static create(props: AdminProps, id?: UniqueEntityID) {
    const admin = new Admin(props, id)

    return admin
  }
}
