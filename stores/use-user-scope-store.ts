
import { RoutePlannerService } from "@/utils/route-planner-service";

const routePlannerService = reactive(new RoutePlannerService());

export function useUserScopeStore() {
  return { routePlannerService };
}
