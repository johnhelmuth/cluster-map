import type {SelectedSystemsListInterface} from "@/types/SystemsSelectedListTypes";
import {SelectedSystemsList} from "@/models/SelectedSystemsList";
import {reactive, ref} from "vue";
import type {RoutePlanType} from "@/types/RoutePlannerTypes";

const selectedSystemsList = reactive(new SelectedSystemsList());
const routePlan = ref([] as RoutePlanType);
export function useUserScopeStore() : {
  selectedSystemsList: SelectedSystemsListInterface,
  routePlan: RoutePlanType
} {
  return { selectedSystemsList, routePlan };
}
