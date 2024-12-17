import { ValueObject } from '@/core/entities/value-object'

interface AddressProps {
  state: string
  city: string
  zipCode: string
  streetAddress: string
  neighborhood: string
}

export class Address extends ValueObject<AddressProps> {
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

  static create(props: AddressProps) {
    return new Address(props)
  }
}
