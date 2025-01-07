import { InMemoryNotificationsRepository } from 'test/repositories/in-memory-notifications-repository'
import { SendNotificationService } from './send-notification'

describe('Send Notification', () => {
  let inMemoryNotificationsRepository: InMemoryNotificationsRepository
  let sut: SendNotificationService

  beforeEach(() => {
    inMemoryNotificationsRepository = new InMemoryNotificationsRepository()
    sut = new SendNotificationService(inMemoryNotificationsRepository)
  })

  it('should be able to send a notification', async () => {
    const result = await sut.execute({
      recipientId: '1',
      parcelId: '1',
      trackingNumber: '1',
      title: 'New notification',
    })

    expect(result.isRight()).toBe(true)
    expect(inMemoryNotificationsRepository.items[0]).toEqual(result.value?.notification)
  })
})
