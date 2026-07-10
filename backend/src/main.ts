import { ValidationPipe, VersioningType } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { NestFactory } from "@nestjs/core";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import compression from "compression";
import helmet from "helmet";

import { AppModule } from "./app.module";
import type { Environment } from "./config/env.validation";

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
  });
  const config = app.get(ConfigService<Environment, true>);
  const appUrl = config.get("APP_URL", { infer: true });
  const port = config.get("PORT", { infer: true });

  app.use(helmet());
  app.use(compression());
  app.enableCors({
    origin: [appUrl],
    credentials: true,
    methods: ["GET", "POST", "PATCH", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "Idempotency-Key"],
  });
  app.setGlobalPrefix("api");
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: "1",
  });
  app.useGlobalPipes(
    new ValidationPipe({
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: false,
      },
      whitelist: true,
    }),
  );

  const swaggerConfig = new DocumentBuilder()
    .setTitle("GearShare API")
    .setDescription("REST API for the GearShare equipment rental marketplace.")
    .setVersion("0.1.0")
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup("api/docs", app, document, {
    swaggerOptions: {
      persistAuthorization: true,
    },
  });

  await app.listen(port);
}

void bootstrap();
