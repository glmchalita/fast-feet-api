import { Entity } from '@/core/entities/entity'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Vehicle } from '../value-objects/vehicle'

export interface CourierProps {
  name: string
  cpf: string
  vehicle?: Vehicle | null
  email: string
  password: string
  latitude?: number | null
  longitude?: number | null
}

export class Courier extends Entity<CourierProps> {
  get name() {
    return this.props.name
  }

  get cpf() {
    return this.props.cpf
  }

  get vehicle(): Vehicle | null | undefined {
    return this.props.vehicle
  }

  get email() {
    return this.props.email
  }

  get password() {
    return this.props.password
  }

  get latitude() {
    return this.props.latitude
  }

  get longitude() {
    return this.props.longitude
  }

  set vehicle(vehicle: Vehicle) {
    this.props.vehicle = vehicle
  }

  set email(email: string) {
    this.props.email = email
  }

  set password(password: string) {
    this.props.password = password
  }

  static create(props: CourierProps, id?: UniqueEntityID) {
    const courier = new Courier(props, id)

    return courier
  }
}
