import { createParamDecorator } from "@nestjs/common";
import type { ExecutionContext } from "@nestjs/common";
import type { Request } from "express";

import type { AuthenticatedRequestUser } from "./auth.types";

export const CurrentUser = createParamDecorator(
  (_data: unknown, context: ExecutionContext): AuthenticatedRequestUser => {
    const request = context.switchToHttp().getRequest<Request>();

    if (!request.user) {
      throw new Error("CurrentUser decorator used without JwtAuthGuard.");
    }

    return request.user;
  },
);
