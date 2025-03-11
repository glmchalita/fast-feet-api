import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { EnvService } from './env/env.service'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)

  const config = new DocumentBuilder()
    .setTitle('FastFeet API')
    .setDescription(
      'API for managing couriers, parcels, and recipients, ensuring the registration and tracking of each delivery stage.',
    )
    .setVersion('1.0')
    .build()

  const documentFactory = () => SwaggerModule.createDocument(app, config)

  SwaggerModule.setup('api', app, documentFactory, {
    swaggerOptions: {
      deepScanRoutes: false,
    },
  })

  const envService = app.get(EnvService)

  const port = envService.get('PORT')

  await app.listen(port)
}
bootstrap()
