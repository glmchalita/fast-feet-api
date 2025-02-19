import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { FactoriesModule } from 'test/factories/factories.module'
import { CourierFactory } from 'test/factories/make-courier'

describe('Upload attachment (E2E)', () => {
  let app: INestApplication
  let courierFactory: CourierFactory
  let jwtService: JwtService

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule, FactoriesModule],
      providers: [JwtService],
    }).compile()

    app = moduleRef.createNestApplication()

    courierFactory = moduleRef.get(CourierFactory)
    jwtService = moduleRef.get(JwtService)

    await app.init()
  })

  test('[POST] /attachments', async () => {
    const courier = await courierFactory.makePrismaCourier()

    const accessToken = jwtService.sign({ sub: courier.id.toString() })

    const response = await request(app.getHttpServer())
      .post(`/attachments`)
      .set('Authorization', `Bearer ${accessToken}`)
      .attach('file', './test/e2e/sample-upload.jpeg')

    expect(response.statusCode).toBe(201)
    expect(response.body).toEqual({
      attachmentId: expect.any(String),
    })
  })
})
