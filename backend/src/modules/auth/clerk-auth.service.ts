import { verifyToken } from "@clerk/backend";
import { Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

import type { Environment } from "@/config/env.validation";

import type { ClerkSessionClaims } from "./auth.types";

@Injectable()
export class ClerkAuthService {
  constructor(private readonly config: ConfigService<Environment, true>) {}

  async verifyBearerToken(authorization?: string): Promise<ClerkSessionClaims> {
    const token = this.extractBearerToken(authorization);

    if (!token) {
      throw new UnauthorizedException("Missing bearer token.");
    }

    const jwtKey = this.configuredValue(
      this.config.get("CLERK_JWT_KEY", { infer: true }),
    );
    const secretKey = this.configuredValue(
      this.config.get("CLERK_SECRET_KEY", { infer: true }),
    );

    if (!jwtKey && !secretKey) {
      throw new UnauthorizedException("Clerk JWT verification is not configured.");
    }

    try {
      const verifiedToken: unknown = await verifyToken(token, {
        jwtKey,
        secretKey,
        audience: this.configuredValue(
          this.config.get("JWT_AUDIENCE", { infer: true }),
        ),
        authorizedParties: this.resolveAuthorizedParties(),
      });

      if (!this.isClerkSessionClaims(verifiedToken)) {
        throw new UnauthorizedException("Token is missing a subject claim.");
      }

      return verifiedToken;
    } catch {
      throw new UnauthorizedException("Invalid or expired bearer token.");
    }
  }

  private extractBearerToken(authorization?: string) {
    const [scheme, token] = authorization?.split(" ") ?? [];

    if (scheme?.toLowerCase() !== "bearer" || !token) {
      return undefined;
    }

    return token;
  }

  private resolveAuthorizedParties() {
    const configured = this.configuredValue(
      this.config.get("CLERK_AUTHORIZED_PARTIES", {
        infer: true,
      }),
    );

    return configured
      ?.split(",")
      .map((origin) => this.configuredValue(origin))
      .filter((origin): origin is string => Boolean(origin))
      .map((origin) => origin.trim())
      .filter(Boolean);
  }

  private configuredValue(value?: string) {
    const trimmed = value?.trim();

    if (
      !trimmed ||
      trimmed.includes("replace_me") ||
      trimmed.includes("replace_with") ||
      trimmed.includes("test_replace") ||
      trimmed.includes("gearshare.local")
    ) {
      return undefined;
    }

    return trimmed;
  }

  private isClerkSessionClaims(value: unknown): value is ClerkSessionClaims {
    return (
      typeof value === "object" &&
      value !== null &&
      "sub" in value &&
      typeof value.sub === "string" &&
      value.sub.length > 0
    );
  }
}
