export interface VehicleProps {
  model: string
  year: string
  licensePlate: string
}

export class Vehicle {
  public readonly model: string
  public readonly year: string
  public readonly licensePlate: string

  private constructor(props: VehicleProps) {
    this.model = props.model
    this.year = props.year
    this.licensePlate = props.licensePlate
  }

  static create(props: VehicleProps): Vehicle {
    return new Vehicle(props)
  }
}
