import { BadRequestException, Body, Controller, HttpCode, Param, Put } from '@nestjs/common'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe'
import { z } from 'zod'
import { Role } from '@/infra/auth/role.decorator'
import { UpdateRecipientAddressService } from '@/domain/delivery/application/services/recipient/update-recipient-address.service'

const updateRecipientAddressBodySchema = z.object({
  state: z.string(),
  city: z.string(),
  zipCode: z.string().length(8),
  streetAddress: z.string(),
  neighborhood: z.string(),
  latitude: z.number().refine((value) => {
    return Math.abs(value) <= 90
  }),
  longitude: z.number().refine((value) => {
    return Math.abs(value) <= 180
  }),
})

const bodyValidationPipe = new ZodValidationPipe(updateRecipientAddressBodySchema)

type UpdateRecipientAddressBodySchema = z.infer<typeof updateRecipientAddressBodySchema>

@Controller('/recipients/:id')
@Role('ADMIN')
export class UpdateRecipientAddressController {
  constructor(private updateRecipientAddress: UpdateRecipientAddressService) {}

  @Put()
  @HttpCode(204)
  async handle(
    @Body(bodyValidationPipe) body: UpdateRecipientAddressBodySchema,
    @Param('id') recipientId: string,
  ) {
    const { state, city, zipCode, streetAddress, neighborhood, latitude, longitude } = body

    const result = await this.updateRecipientAddress.execute({
      recipientId,
      state,
      city,
      zipCode,
      streetAddress,
      neighborhood,
      latitude,
      longitude,
    })

    if (result.isLeft()) {
      throw new BadRequestException()
    }
  }
}
