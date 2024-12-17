import { ValueObject } from '@/core/entities/value-object'

export interface RecipientProps {
  name: string
  cpf: string
}

export class Recipient extends ValueObject<RecipientProps> {
  get name() {
    return this.props.name
  }

  get cpf() {
    return this.props.cpf
  }

  static create(props: RecipientProps) {
    const recipient = new Recipient(props)

    return recipient
  }
}
