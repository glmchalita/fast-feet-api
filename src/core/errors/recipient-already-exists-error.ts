import { ServiceError } from './service-error'

export class RecipientAlreadyExistsError extends Error implements ServiceError {
  constructor(identifier: string) {
    super(`Recipient "${identifier}" already exists.`)
  }
}
