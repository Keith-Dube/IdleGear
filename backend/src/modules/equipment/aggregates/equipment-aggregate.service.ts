import { Injectable } from "@nestjs/common";

import { PrismaService } from "@/prisma/prisma.service";

import {
  recalculateEquipmentAggregates,
  type EquipmentAggregateSnapshot,
} from "./equipment-aggregate.calculator";

@Injectable()
export class EquipmentAggregateService {
  constructor(private readonly prisma: PrismaService) {}

  recalculateForEquipment(
    equipmentId: string,
  ): Promise<EquipmentAggregateSnapshot[]> {
    return recalculateEquipmentAggregates(this.prisma, [equipmentId]);
  }

  recalculateMany(equipmentIds: string[]): Promise<EquipmentAggregateSnapshot[]> {
    return recalculateEquipmentAggregates(this.prisma, equipmentIds);
  }
}
