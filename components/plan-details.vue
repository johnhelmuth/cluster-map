<script setup lang="ts">

import type {RoutePlanType} from "~/types/RoutePlannerTypes";
import {useUserScopeStore} from "~/stores/use-user-scope-store";
import type {ClusterModelInterface} from "~/types/ClusterTypes";

const props = defineProps<{
  cluster?: ClusterModelInterface,
  maxPlansPerGroup?: number | undefined,
  maxGroups?: number | undefined,
  startOpened?: boolean,
}>()

const DEFAULT_MAX_PLANS_PER_GROUP = 5;
const DEFAULT_MAX_GROUPS = 3;
const SHOW_LESS_TOTAL = 4;

const emit = defineEmits<{
  "plan-selected": [index: number];
  "opened": [];
  "closed": [];
  "swap": [];
}>()

const {routePlannerService} = useUserScopeStore();

const originSystem = computed(() => routePlannerService.selectedSystemsList.selectedSystems?.[0])
const destinationSystem = computed(() => routePlannerService.selectedSystemsList.selectedSystems?.[1])

type PlanDetailType = {
  planIndex: number;
  plan: RoutePlanType;
}

const plansByLength = computed(() => {
  if (routePlannerService.routePlans?.length) {
    const p = new Map<number, PlanDetailType[]>();
    const plans = routePlannerService.routePlans;
    const totalPlans = plans.length;
    for (let planIndex = 0; planIndex < totalPlans; planIndex++) {
      const plan = plans[planIndex];
      if (plan) {
        const planLen = plan.length || 0;
        let planList = p.get(planLen) || [] as PlanDetailType[];
        planList.push({planIndex, plan} as PlanDetailType);
        p.set(planLen, planList);
      }
    }
    return [...p.entries()];
  }
})

function selectPlan(e: MouseEvent) {
  const target = e.target as HTMLElement;
  const planEl = target.closest('[data-plan-index]') as HTMLElement;
  const planIndex = parseInt(planEl.dataset.planIndex || '-1');
  if (planIndex >= 0 && typeof routePlannerService.routePlans?.[planIndex] !== 'undefined') {
    emit('plan-selected', planIndex);
  }
}

const iconExpandedName = 'material-symbols:expand-all-rounded'
const iconCollapsedName = 'material-symbols:collapse-all-rounded'
const expandCollapseIcon = ref(iconExpandedName);

const planDetailsClosed = ref(typeof props.startOpened === 'undefined' ? true : !props.startOpened);

function toggleAccordion() {
  planDetailsClosed.value = !planDetailsClosed.value;
  expandCollapseIcon.value = planDetailsClosed.value ? iconExpandedName : iconCollapsedName;
  if (planDetailsClosed.value) {
    emit('closed');
  } else {
    emit('opened');
  }
}

const showAllPlans = ref(planDetailsClosed.value || false);

function toggleShowAllPlans() {
  showAllPlans.value = !showAllPlans.value;
}

const hasShowMoreButton = computed(() => routePlannerService.routePlans?.length > SHOW_LESS_TOTAL)

function groupIsEmptyWhenAbbreviatedList(planDetails: PlanDetailType[]) {
  return planDetails.filter(({planIndex}) => planIndex < SHOW_LESS_TOTAL).length < 1;
}

function swapOriginDestination() {
  emit('swap');
}

</script>

<template>
  <div class="plan-details"
       v-if="routePlannerService.selectedSystemsList.isMaxSelected && routePlannerService.routePlans?.length"
       :class="{'has-show-more-button': hasShowMoreButton, 'show-all-plans': showAllPlans}"
  >
    <h2 v-if="originSystem && destinationSystem">
      <span>Routes from {{ originSystem.name }} to {{ destinationSystem.name }}</span>
      <Icon name="material-symbols:swap-horiz-rounded" @click="swapOriginDestination" />
      <Icon id="accordion-button" class="button-icon accordion-button" @click="toggleAccordion"
            :name="expandCollapseIcon"/>
    </h2>
    <ul class="plan-list-by-length" :class="{ open: ! planDetailsClosed }">
      <template v-if="plansByLength"
                v-for="[systemCount, plans] in plansByLength.slice(0, maxGroups || DEFAULT_MAX_GROUPS)"
                :key="systemCount"
      >
        <li :class="{ 'is-empty-when-abbreviated-list': ! showAllPlans && groupIsEmptyWhenAbbreviatedList(plans) }"
        >
          <span class="plan-step-count">Plans with {{ systemCount - 1 }}</span> strait jumps:
          <ul class="plan-list">
            <li v-for="{planIndex: index, plan} of plans.slice(0, maxPlansPerGroup||DEFAULT_MAX_PLANS_PER_GROUP)"
                :key="index"
                :data-plan-index="index"
                @click="selectPlan"
                class="plan-list-item"
                :class="{ selected: routePlannerService.isCurrentPlanIndex(index), 'is-more': (hasShowMoreButton && index >= SHOW_LESS_TOTAL)}"
            >
              <div v-if="plan.length">
                <span v-for="system in plan" :key="system.id"
                      class="step-label"
                      :class="{ 'in-current-cluster': (plan === routePlannerService.routePlan ? system.cluster === props.cluster : false)}"
                >{{ system.name }}</span>
              </div>
            </li>
          </ul>
        </li>
      </template>
    </ul>
    <div class="show-more-or-less" :class="{ hidden: planDetailsClosed }" @click="toggleShowAllPlans">
      <span v-if="showAllPlans">Show less</span>
      <span v-else>Show more</span>
    </div>
  </div>
</template>

<style scoped>
.plan-details {
  padding: 0.5rem;
  border-radius: .5rem;
  background-color: rgb(from var(--color-background) r g b / .9)
}

h2 {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

h2 > *:nth-child(2) {
  margin-right: auto;
  margin-left: 1rem;
  cursor: pointer;
}

h2 > *:last-child {
  cursor: pointer;
}

ul.plan-list-by-length {
  list-style: none;
  padding: 0 .5rem;
  display: none;
}
ul.plan-list-by-length.open {
  display: block;
}
ul.plan-list-by-length > li.is-empty-when-abbreviated-list {
  display: none;
}

ul.plan-list {
  list-style: none;
  padding: 0 1rem;
}

li.plan-list-item {
  border-bottom: 0.5px solid var(--color-border);
  margin-bottom: 0.5rem;
  cursor: pointer;
}

.plan-details.has-show-more-button:not(.show-all-plans) li.plan-list-item.is-more {
  display: none;
}

li.selected {
  background-color: var(--color-background-mute);
  border: 1px solid var(--color-border);
}

.step-label.in-current-cluster {
  font-weight: bold;
}
.step-label:after {
  content: " > ";
}

.step-label:last-child:after {
  content: "";
}

.plan-details.has-show-more-button .show-more-or-less {
  text-align: center;
  cursor: pointer;
  font-style: italic;
  padding: .5rem;
}

.plan-details:not(.has-show-more-button) .show-more-or-less, .plan-details .show-more-or-less.hidden {
  display: none;
}


</style>