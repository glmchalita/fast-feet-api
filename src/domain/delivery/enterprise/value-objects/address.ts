export interface AddressProps {
  state: string
  city: string
  zipCode: string
  streetAddress: string
  neighborhood: string
  latitude: number
  longitude: number
}

export class Address {
  public readonly state: string
  public readonly city: string
  public readonly zipCode: string
  public readonly streetAddress: string
  public readonly neighborhood: string
  public readonly latitude: number
  public readonly longitude: number

  private constructor(props: AddressProps) {
    this.state = props.state
    this.city = props.city
    this.zipCode = props.zipCode
    this.streetAddress = props.streetAddress
    this.neighborhood = props.neighborhood
    this.latitude = props.latitude
    this.longitude = props.longitude
  }

  static create(props: AddressProps): Address {
    return new Address(props)
  }
}
