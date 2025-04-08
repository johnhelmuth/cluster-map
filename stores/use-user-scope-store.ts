
import {SelectedSystemsService} from "@/models/SelectedSystemsService";
import { RoutePlannerService } from "@/utils/route-planner-service";

const selectedSystemsService = new SelectedSystemsService();

const routePlannerService = new RoutePlannerService();

export function useUserScopeStore() : {
  routePlannerService: RoutePlannerService,
  selectedSystemsService: SelectedSystemsService,
} {
  return { routePlannerService, selectedSystemsService };
}
