import { Controller, Get } from "@nestjs/common";
import { ApiOkResponse, ApiTags } from "@nestjs/swagger";

import { PrismaService } from "@/prisma/prisma.service";

type HealthResponse = {
  status: "ok";
  service: "gearshare-api";
  timestamp: string;
  database: "reachable";
};

@ApiTags("health")
@Controller("health")
export class HealthController {
  constructor(private readonly prisma: PrismaService) {}

  @Get()
  @ApiOkResponse({ description: "Service and database health status." })
  async check(): Promise<HealthResponse> {
    await this.prisma.$queryRaw`SELECT 1`;

    return {
      status: "ok",
      service: "gearshare-api",
      timestamp: new Date().toISOString(),
      database: "reachable",
    };
  }
}
