<script setup lang="ts">
import Bezel from "@/components/Bezel.vue"
import ClusterMapPanel from "@/components/ClusterMapPanel.vue";
import ClusterMapControlsPanel from "@/components/ClusterMapControlsPanel.vue";

</script>

<template>
  <Bezel>
    <template v-slot:display>
      <ClusterMapPanel/>
    </template>
    <template v-slot:controls>
      <ClusterMapControlsPanel/>
    </template>
  </Bezel>
</template>
