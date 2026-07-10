import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";

import { RateLimitMiddleware } from "@/common/middleware/rate-limit.middleware";
import { validateEnv } from "@/config/env.validation";
import { EquipmentModule } from "@/modules/equipment/equipment.module";
import { HealthModule } from "@/modules/health/health.module";
import { MeModule } from "@/modules/me/me.module";
import { UploadsModule } from "@/modules/uploads/uploads.module";
import { PrismaModule } from "@/prisma/prisma.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      cache: true,
      envFilePath: [".env", "../.env"],
      isGlobal: true,
      validate: validateEnv,
    }),
    PrismaModule,
    HealthModule,
    EquipmentModule,
    MeModule,
    UploadsModule,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(RateLimitMiddleware)
      .forRoutes({ path: "*", method: RequestMethod.ALL });
  }
}
