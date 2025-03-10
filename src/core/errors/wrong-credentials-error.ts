import { ServiceError } from './service-error'

export class WrongCredentialsError extends Error implements ServiceError {
  constructor() {
    super('Credentials are not valid.')
  }
}
