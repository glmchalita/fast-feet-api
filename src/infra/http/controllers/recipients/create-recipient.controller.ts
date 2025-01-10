import { RecipientAlreadyExistsError } from '@/core/errors/recipient-already-exists-error'
import { CreateRecipientService } from '@/domain/delivery/application/services/recipient/create-recipient'
import {
  BadRequestException,
  Body,
  ConflictException,
  Controller,
  HttpCode,
  Post,
  UsePipes,
} from '@nestjs/common'
import { z } from 'zod'
import { ZodValidationPipe } from '../../pipes/zod-validation-pipe'
import { Public } from '@/infra/auth/public'

const createRecipientBodySchema = z.object({
  name: z.string(),
  cpf: z.string().length(11),
  email: z.string().email(),
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

type CreateRecipientBodySchema = z.infer<typeof createRecipientBodySchema>

@Controller('/recipients')
@Public()
export class CreateRecipientController {
  constructor(private createRecipient: CreateRecipientService) {}

  @Post()
  @HttpCode(201)
  @UsePipes(new ZodValidationPipe(createRecipientBodySchema))
  async handle(@Body() body: CreateRecipientBodySchema) {
    const {
      name,
      cpf,
      email,
      state,
      city,
      zipCode,
      streetAddress,
      neighborhood,
      latitude,
      longitude,
    } = body

    const result = await this.createRecipient.execute({
      name,
      cpf,
      email,
      state,
      city,
      zipCode,
      streetAddress,
      neighborhood,
      latitude,
      longitude,
    })

    if (result.isLeft()) {
      const error = result.value

      switch (error.constructor) {
        case RecipientAlreadyExistsError:
          throw new ConflictException(error.message)
        default:
          throw new BadRequestException(error.message)
      }
    }
  }
}
