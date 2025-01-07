import { ServiceError } from './service-error'

export class VehicleAlreadyRegisteredError extends Error implements ServiceError {
  constructor(identifier: string) {
    super(`Vehicle "${identifier}" already registered.`)
  }
}
