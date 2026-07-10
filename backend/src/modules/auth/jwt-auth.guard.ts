import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { UserRole } from "@prisma/client";
import type { Request } from "express";

import { PrismaService } from "@/prisma/prisma.service";

import { ClerkAuthService } from "./clerk-auth.service";

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private readonly clerkAuth: ClerkAuthService,
    private readonly prisma: PrismaService,
  ) {}

  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest<Request>();
    const claims = await this.clerkAuth.verifyBearerToken(
      request.headers.authorization,
    );

    if (!claims.sub) {
      throw new UnauthorizedException("Invalid Clerk session.");
    }

    const user = await this.prisma.user.findUnique({
      where: { externalAuthId: claims.sub },
      include: { roleGrants: true },
    });

    request.user = {
      clerkUserId: claims.sub,
      sessionId: claims.sid,
      claims,
      roles: user?.roleGrants.map((grant) => grant.role) ?? [UserRole.RENTER],
    };

    return true;
  }
}
