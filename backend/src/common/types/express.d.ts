import type { AuthenticatedRequestUser } from "@/modules/auth/auth.types";

declare module "express-serve-static-core" {
  interface Request {
    user?: AuthenticatedRequestUser;
  }
}
