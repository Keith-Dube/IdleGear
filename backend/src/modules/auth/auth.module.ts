import { Module } from "@nestjs/common";

import { ClerkAuthService } from "./clerk-auth.service";
import { JwtAuthGuard } from "./jwt-auth.guard";
import { RolesGuard } from "./roles.guard";

@Module({
  providers: [ClerkAuthService, JwtAuthGuard, RolesGuard],
  exports: [ClerkAuthService, JwtAuthGuard, RolesGuard],
})
export class AuthModule {}
