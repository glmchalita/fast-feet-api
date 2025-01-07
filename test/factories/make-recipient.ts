import { Recipient, RecipientProps } from '@/domain/delivery/enterprise/entities/recipient'
import { AddressProps } from '@/domain/delivery/enterprise/value-objects/address'
import { faker } from '@faker-js/faker'

type PartialRecipientProps = {
  [K in keyof RecipientProps]?: K extends 'address' ? Partial<AddressProps> : RecipientProps[K]
}

export function makeRecipient(overwrite: PartialRecipientProps = {}) {
  const recipient = Recipient.create({
    name: faker.person.firstName(),
    cpf: faker.string.numeric(11),
    email: faker.internet.email(),
    address: {
      state: faker.location.state(),
      city: faker.location.city(),
      zipCode: faker.location.zipCode(),
      streetAddress: faker.location.streetAddress(),
      neighborhood: faker.location.county(),
      latitude: faker.location.latitude(),
      longitude: faker.location.longitude(),
      ...(overwrite.address || {}),
    },
  })

  return recipient
}
