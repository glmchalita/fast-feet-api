import { Status } from './status'

export class StatusHistory {
  constructor(
    public readonly status: Status,
    public readonly date: Date,
  ) {}

  equals(other: StatusHistory): boolean {
    return this.status.equals(other.status) && this.date.getTime() === other.date.getTime()
  }
}
