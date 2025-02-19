import { InMemoryParcelsRepository } from 'test/repositories/in-memory-parcels-repository'
import { Status } from '@/domain/delivery/enterprise/value-objects/status'
import { makeParcel } from 'test/factories/make-parcel'
import { InMemoryRecipientsRepository } from 'test/repositories/in-memory-recipients-repository'
import { InMemoryCouriersRepository } from 'test/repositories/in-memory-couriers-repository'
import { UpdateParcelCourierService } from './update-parcel-courier.service'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { assertRight } from '@/core/either'
import { makeCourier } from 'test/factories/make-courier'
import { InMemoryParcelAttachmentRepository } from 'test/repositories/in-memory-parcel-attachment-repository'

describe('Update parcel courierId', () => {
  let inMemoryRecipientsRepository: InMemoryRecipientsRepository
  let inMemoryParcelAttachmentRepository: InMemoryParcelAttachmentRepository
  let inMemoryParcelsRepository: InMemoryParcelsRepository
  let inMemoryCouriersRepository: InMemoryCouriersRepository
  let sut: UpdateParcelCourierService

  beforeEach(() => {
    inMemoryRecipientsRepository = new InMemoryRecipientsRepository()
    inMemoryParcelAttachmentRepository = new InMemoryParcelAttachmentRepository()
    inMemoryParcelsRepository = new InMemoryParcelsRepository(
      inMemoryRecipientsRepository,
      inMemoryParcelAttachmentRepository,
    )
    inMemoryCouriersRepository = new InMemoryCouriersRepository()
    sut = new UpdateParcelCourierService(inMemoryParcelsRepository, inMemoryCouriersRepository)
  })

  it('should be able to update a courierId on parcel', async () => {
    const courier = makeCourier()

    const courierId = courier.id.toString()

    await inMemoryCouriersRepository.create(courier)

    const parcel = makeParcel({ courierId: new UniqueEntityID('courier-1') })

    const parcelId = parcel.id.toString()

    await inMemoryParcelsRepository.create(parcel)

    const result = await sut.execute({ parcelId, courierId })

    assertRight(result)

    expect(result.isRight()).toBe(true)
    expect(inMemoryParcelsRepository.items[0]).toEqual(
      expect.objectContaining({
        courierId: courier.id,
        currentStatus: Status.ORDER_CREATED,
      }),
    )
  })
})
