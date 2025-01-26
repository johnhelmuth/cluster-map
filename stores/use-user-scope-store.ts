import type {SelectedSystemsListInterface, SelectedSystemsServiceInterface} from "@/types/SystemsSelectedListTypes";

import {SelectedSystemsService} from "@/models/SelectedSystemsService";
import { RoutePlannerService } from "@/utils/route-planner-service";
import type {RoutePlannerServiceInterface} from "@/types/RoutePlannerServiceTypes";

const selectedSystemsService = new SelectedSystemsService();

const routePlannerService = new RoutePlannerService();

/** TODO: Convert this to a pinia store using `defineStore()` so that refreshes don't reset them.
 *        Will have to implement toJSON() on both services, and add a Nuxt PayloadPlugin for each.
 *        See `plugins/universes-payload.ts` for how to do that.
 */
export function useUserScopeStore() : {
  routePlannerService: RoutePlannerServiceInterface,
  selectedSystemsService: SelectedSystemsServiceInterface,
} {
  return { routePlannerService, selectedSystemsService };
}
