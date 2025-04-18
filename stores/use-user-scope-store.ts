import type {SelectedSystemsListInterface, SelectedSystemsServiceInterface} from "@/types/SystemsSelectedListTypes";

import {SelectedSystemsService} from "@/models/SelectedSystemsService";
import { RoutePlannerService } from "@/utils/route-planner-service";
import type {RoutePlannerServiceInterface} from "@/types/RoutePlannerServiceTypes";

const selectedSystemsService = new SelectedSystemsService();

const routePlannerService = new RoutePlannerService();

export function useUserScopeStore() : {
  routePlannerService: RoutePlannerServiceInterface,
  selectedSystemsService: SelectedSystemsServiceInterface,
} {
  return { routePlannerService, selectedSystemsService };
}
