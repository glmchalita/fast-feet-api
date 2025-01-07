export class Status {
  private constructor(private readonly value: string) {}

  static readonly ORDER_CREATED = new Status('Order created')
  static readonly READY_FOR_COLLECT = new Status('Ready for Collect')
  static readonly COLLECTED = new Status('Collected')
  static readonly OUT_FOR_DELIVERY = new Status('Out for Delivery')
  static readonly DELIVERED = new Status('Delivered')
  static readonly RETURNED = new Status('Returned')

  /* eslint-disable-next-line no-use-before-define */
  private static readonly validTransitions: Map<Status, Status[]> = new Map([
    [Status.ORDER_CREATED, [Status.READY_FOR_COLLECT]],
    [Status.READY_FOR_COLLECT, [Status.COLLECTED]],
    [Status.COLLECTED, [Status.OUT_FOR_DELIVERY]],
    [Status.OUT_FOR_DELIVERY, [Status.DELIVERED, Status.RETURNED]],
    [Status.DELIVERED, []],
    [Status.RETURNED, []],
  ])

  getValue(): string {
    return this.value
  }

  equals(other: Status): boolean {
    return this.value === other.value
  }

  static isValidTransition(from: Status, to: Status): boolean {
    const allowedTransitions = this.validTransitions.get(from) || []
    return allowedTransitions.some((status) => status.equals(to))
  }
}
