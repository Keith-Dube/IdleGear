import { Injectable, NestMiddleware } from "@nestjs/common";
import type { NextFunction, Request, Response } from "express";

type RateLimitBucket = {
  count: number;
  resetAt: number;
};

const WINDOW_MS = 60_000;
const MAX_REQUESTS = 120;

@Injectable()
export class RateLimitMiddleware implements NestMiddleware {
  private readonly buckets = new Map<string, RateLimitBucket>();
  private lastCleanupAt = Date.now();

  use(request: Request, response: Response, next: NextFunction) {
    const now = Date.now();
    this.cleanup(now);

    const key = this.resolveClientKey(request);
    const bucket = this.buckets.get(key);

    if (!bucket || bucket.resetAt <= now) {
      const resetAt = now + WINDOW_MS;
      this.buckets.set(key, {
        count: 1,
        resetAt,
      });
      this.setHeaders(response, MAX_REQUESTS - 1, resetAt);
      next();
      return;
    }

    bucket.count += 1;
    const remaining = Math.max(MAX_REQUESTS - bucket.count, 0);
    this.setHeaders(response, remaining, bucket.resetAt);

    if (bucket.count > MAX_REQUESTS) {
      response.status(429).json({
        statusCode: 429,
        message: "Too many requests. Please retry shortly.",
        retryAfterSeconds: Math.ceil((bucket.resetAt - now) / 1000),
      });
      return;
    }

    next();
  }

  private resolveClientKey(request: Request) {
    const forwardedFor = request.headers["x-forwarded-for"];
    const forwardedIp = Array.isArray(forwardedFor)
      ? forwardedFor[0]
      : forwardedFor?.split(",")[0];

    return (
      forwardedIp?.trim() ||
      request.ip ||
      request.socket.remoteAddress ||
      "unknown"
    );
  }

  private setHeaders(response: Response, remaining: number, resetAt: number) {
    response.setHeader("RateLimit-Limit", String(MAX_REQUESTS));
    response.setHeader("RateLimit-Remaining", String(remaining));
    response.setHeader("RateLimit-Reset", String(Math.ceil(resetAt / 1000)));
  }

  private cleanup(now: number) {
    if (now - this.lastCleanupAt < WINDOW_MS) {
      return;
    }

    for (const [key, bucket] of this.buckets.entries()) {
      if (bucket.resetAt <= now) {
        this.buckets.delete(key);
      }
    }

    this.lastCleanupAt = now;
  }
}
