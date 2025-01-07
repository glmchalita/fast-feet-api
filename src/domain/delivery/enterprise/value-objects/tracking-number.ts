export class TrackingNumber {
  private value: string

  toString() {
    return this.value
  }

  toValue() {
    return this.value
  }

  constructor(value?: string) {
    this.value = value ?? this.trackingNumber()
  }

  equals(id: TrackingNumber) {
    return id.toValue() === this.value
  }

  trackingNumber() {
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
    const numbers = '0123456789'

    const randomLetters = Array.from({ length: 4 })
      .map(() => letters.charAt(Math.floor(Math.random() * letters.length)))
      .join('')

    const randomNumbers = Array.from({ length: 9 })
      .map(() => numbers.charAt(Math.floor(Math.random() * numbers.length)))
      .join('')

    return randomLetters + randomNumbers
  }
}
