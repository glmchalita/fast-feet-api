import { SendNotificationService } from '../service/send-notification'
import { InMemoryNotificationsRepository } from 'test/repositories/in-memory-notifications-repository'
import { MockInstance } from 'vitest'
import { OnParcelStatusUpdate } from './on-parcel-status-update'
import { InMemoryParcelsRepository } from 'test/repositories/in-memory-parcels-repository'
import { InMemoryRecipientsRepository } from 'test/repositories/in-memory-recipients-repository'
import { makeParcel } from 'test/factories/make-parcel'
import { waitFor } from 'test/utils/wait-for'

describe('On parcel status update', () => {
  let inMemoryRecipientsRepository: InMemoryRecipientsRepository
  let inMemoryParcelsRepository: InMemoryParcelsRepository
  let inMemoryNotificationsRepository: InMemoryNotificationsRepository
  let sendNotificationService: SendNotificationService
  let sendNotificationExecuteSpy: MockInstance<SendNotificationService['execute']>

  beforeEach(() => {
    inMemoryRecipientsRepository = new InMemoryRecipientsRepository()
    inMemoryParcelsRepository = new InMemoryParcelsRepository(inMemoryRecipientsRepository)
    inMemoryNotificationsRepository = new InMemoryNotificationsRepository()
    sendNotificationService = new SendNotificationService(inMemoryNotificationsRepository)

    sendNotificationExecuteSpy = vi.spyOn(sendNotificationService, 'execute')

    new OnParcelStatusUpdate(inMemoryParcelsRepository, sendNotificationService)
  })

  it('should send a notification when a parcel status is updated', async () => {
    const parcel = makeParcel()

    await inMemoryParcelsRepository.create(parcel)

    parcel.markReadyForCollect()

    await inMemoryParcelsRepository.save(parcel)

    await waitFor(() => {
      expect(sendNotificationExecuteSpy).toHaveBeenCalled()
    })
  })
})
