import { ServiceError } from './service-error'

export class CourierAlreadyExistsError extends Error implements ServiceError {
  constructor(identifier: string) {
    super(`Courier "${identifier}" already exists.`)
  }
}
