<script setup lang="ts">

import {useClustersStore} from "~/stores/use-clusters-store";
import {useUserScopeStore} from '~/stores/use-user-scope-store'
import type {SystemModelInterface} from "~/types/SystemTypes";
import {ClusterModel} from "~/models/ClusterModel";

const clustersStore = useClustersStore();
const route = useRoute();
const router = useRouter();

const {routePlannerService} = useUserScopeStore();

const message = ref<string>('');

const cluster = computed(() => {
  const slugOrId = route.params.clusterSlug;
  if (slugOrId && typeof slugOrId === "string") {
    const clust = clustersStore.clusters.getClusterBySlugOrId(slugOrId);
    if (clust) {
      if (clust.id === slugOrId) {
        return navigateTo(
            { name: 'map-clusterSlug', params: { clusterSlug: clust.slug } },
            {redirectCode: 308}
        );
      }
      return clust;
    }
    throw createError({ statusCode: 404, statusMessage: 'No cluster with that name or ID.'})
  }
}) as ComputedRef<ClusterModel | undefined>;

useHead({
  link: [
    {
      rel: "canonical",
      href: computed(() => {
        if (cluster.value instanceof ClusterModel) {
          const canonRoute = router.resolve({name: 'map-clusterSlug', params: { clusterSlug: cluster.value.slug }});
          return canonRoute.fullPath;
        }
      })
    }
  ]
})

useSeoMeta({
  title: computed(() => {
    if (cluster.value instanceof ClusterModel) {
      return cluster?.value?.name
    }
  })
});

useServerSeoMeta({
  title: computed(() => {
    if (cluster.value instanceof ClusterModel) {
      return cluster?.value?.name
    }
  })
});

function systemSelected(system: SystemModelInterface) {
  if (cluster.value) {
    if (routePlannerService.selectedSystemsList) {
      routePlannerService.selectedSystemsList.selectSystem(system);
      if (!routePlannerService.selectedSystemsList.isMaxSelected) {
        routePlannerService.deleteAllRoutePlans();
        return;
      }
      const [systemA, systemB] = routePlannerService.selectedSystemsList.selectedSystems;
      if (!systemA || !systemB) {
        throw new Error("Weird that no systems are selected but planTrip() was called.");
      }
      message.value = 'Calculating navigation parameters...';
      setTimeout(() => {
        routePlannerService.plan(systemA, systemB);
        message.value = '';
      }, 0)
    }
  }
}

function planSelected(planIndex: number) {
  if (typeof routePlannerService.hasPlan(planIndex) !== "undefined") {
    routePlannerService.setRoutePlan(planIndex);
  }
}

function swapEndpoints() {
  message.value = 'Recalculating navigation parameters...';
  setTimeout(() => {
    routePlannerService.swapEndpoints();
    message.value = '';
  }, 0)
}

</script>

<template>
  <Bezels>
    <template v-slot:display>
      <ClusterMapPanel
          v-if="cluster"
          :cluster="cluster"
          :message="message"
          @system-selected="systemSelected"
          @plan-selected="planSelected"
          @swap-endpoints="swapEndpoints"
      />
      <div v-else class="no-data-display">
        No cluster with that name or ID.
        <NuxtLink to="/maps">Return to maps.</NuxtLink>
      </div>
    </template>
    <template v-slot:controls>
      <ClusterMapControlsPanel
          :cluster="cluster"
          @system-selected="systemSelected"
      />
    </template>
  </Bezels>
</template>

<style scoped>

.no-data-display {
  justify-self: center;
  align-self: center;
  margin-top: 30cqh;
  font-size: 1.5rem;
  color: var(--vt-c-text-dark-2);
}

.no-data-display a {
  color: var(--vt-c-text-dark-2);
  font-weight: bold;
}
</style>