import type { UserRole } from "@prisma/client";

export type ClerkSessionClaims = {
  sub: string;
  sid?: string;
  azp?: string;
  iss?: string;
  aud?: string | string[];
  exp?: number;
  iat?: number;
  nbf?: number;
  [claim: string]: unknown;
};

export type AuthenticatedRequestUser = {
  clerkUserId: string;
  sessionId?: string;
  roles: UserRole[];
  claims: ClerkSessionClaims;
};
