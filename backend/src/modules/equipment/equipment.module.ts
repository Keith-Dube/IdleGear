import { Module } from "@nestjs/common";

import { AuthModule } from "@/modules/auth/auth.module";

import { EquipmentAggregateService } from "./aggregates/equipment-aggregate.service";
import {
  EquipmentController,
  OwnerEquipmentController,
} from "./equipment.controller";
import { EquipmentRepository } from "./repositories/equipment.repository";
import { EquipmentService } from "./equipment.service";

@Module({
  imports: [AuthModule],
  controllers: [EquipmentController, OwnerEquipmentController],
  providers: [EquipmentAggregateService, EquipmentRepository, EquipmentService],
  exports: [EquipmentAggregateService, EquipmentRepository, EquipmentService],
})
export class EquipmentModule {}
