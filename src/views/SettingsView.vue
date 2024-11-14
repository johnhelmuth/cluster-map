<script setup lang="ts">

import InfoPageLayout from "@/layouts/InfoPageLayout.vue";
import { useFileDialog } from '@vueuse/core';

import { useClustersStore } from "@/stores/ClustersStore";
import type {ClustersModelDataType} from "@/types/ClusterTypes";
import {useUserScopeStore} from "@/stores/UserScopeStore";
import {ref, computed, watch, type Ref} from "vue";

const {clusters} = useClustersStore();
const {routePlannerService, selectedSystemsService} = useUserScopeStore();

const { files, open, reset, onCancel, onChange } = useFileDialog({
  accept: 'application/json', // Set to accept only JSON files
})

const importFile:File = ref(null);
console.log('SettingsView.setup() importFile.value: ', importFile.value)

const importedData: Ref<object> = ref({});

watch(importFile, async () => {
  let importedJSON: string = undefined;
  if (importFile.value) {
    try {
      importedJSON = await importFile.value.text();
      console.log('importedJSON', importedJSON);
      importedData.value = JSON.parse(importedJSON);
      console.log('importedData.value: ', importedData.value);
    } catch (err) {
      console.error(err);
    }
  } else {
    importedData.value = {}
  }
});


const fileSelected = computed(() => !! importFile.value);

const importedClustersStats = computed(() => {
  const stats = {
    numClusters: null,
    numSystems: null,
    currentClusterId: null,
    currentClusterName: null,
  };
  if (importedData.value) {
    const importedDataRaw = importedData.value;
    console.log('importedClusterStats getter importedDataRaw: ', importedDataRaw);
    if (importedDataRaw?.clusters && importedDataRaw?.clusters.hasOwnProperty('length')) {
      stats.numClusters = importedDataRaw.clusters.length;
      let systemCount = null;
      for (const cluster of importedDataRaw.clusters) {
        console.log('importedDataRaw cluster: ', cluster);
        if (cluster?.systems && cluster.systems.hasOwnProperty('length') && cluster.systems.length) {
          systemCount += cluster.systems.length;
        }
      }
      stats.numSystems = systemCount;
      if (importedDataRaw?.currentClusterId) {
        const currentCluster = importedDataRaw.clusters.find(cluster => cluster.id === importedDataRaw.currentClusterId);
        if (currentCluster) {
          stats.currentClusterId = importedDataRaw.currentClusterId;
          stats.currentClusterName = currentCluster.name;
        }
      }
    }
  }
  return stats;
});

function exportData(e : Event) {
  console.log('exportData() click.');
  downloadJSON(clusters, 'clusters.json');
}

function downloadJSON(data : any, filename: string) {
  // credit: https://www.bitdegree.org/learn/javascript-download
  // credit2: https://www.raymondcamden.com/2020/12/15/vue-quick-shot-downloading-data-as-a-file
  const text = JSON.stringify(data);
  const element = document.createElement('a');
  element.setAttribute('href', 'data:application/json;charset=utf-8,' + encodeURIComponent(text));
  element.setAttribute('download', filename);

  element.style.display = 'none';
  document.body.appendChild(element);

  element.click();
  document.body.removeChild(element);
}

function updateClusters(data: ClustersModelDataType | undefined) {
  console.log('updateClusters().');
  if (data && data?.currentClusterId && data?.clusters?.length > 0) {
    console.log('updateClusters() routePlannerService: ', routePlannerService);
    console.log('updateClusters() selectedSystemsService: ', selectedSystemsService);
    console.log('updateClusters() data: ', data);
    console.log('updateClusters() clusters: ', clusters);
    routePlannerService.deleteAllRoutePlans();
    selectedSystemsService.deleteAllSelectedSystems();
    clusters.parseClustersData(data);
    console.log('updateClusters() clusters: ', clusters);
  }
}

onChange((files) => {
  console.log('import changed: files: ', files);
  if (files) {
    importFile.value = files[0];
  }
})

function applyImport() {
  console.log('Apply import clicked.');
  updateClusters(importedData.value);
  importedData.value = {};
  importFile.value = null;
  reset();
}

function cancelImport() {
  console.log('Cancel import clicked.');
  importFile.value = null;
  reset();
}

</script>

<template>
  <InfoPageLayout page_title="Settings" max-width-rems="40">
    <template v-slot:page_contents>
      <main>
        <section class="settings">
          <h2>Settings</h2>
          <p>Things that change how the site works.</p>
          <p>Nothing right now. More to come!</p>
        </section>
        <section class="actions">
          <h2>Actions</h2>
          <p>Things you do with the data on the site.</p>
          <section class="import-export">
            <h3>Import / Export</h3>
            <p>Import or export data for all clusters from or to JSON</p>
            <div class="control-group control-group-grid data-import-export">
              <div>
                <button type="button" class="import-data" :class="fileSelected ? 'file-selected' : ''" :disabled="fileSelected" @click="open">
                  <div class="action" >Import</div>
                </button>
              </div>
              <div>
                <button @click="exportData">
                  <div class="action">Export</div>
                </button>
              </div>
            </div>
            <div class="control-group">
              <div class="import-actions">
                <h3>Import file</h3>
                <div v-if="importFile" class="import-file-apply">
                  <ul class="note">
                    <li>{{ importFile.name }}</li>
                    <li>{{ importFile.type }}</li>
                    <li>{{ importFile.size }}</li>
                    <!--                  <p>{{importedData}}</p>-->
                    <li>Clusters count: {{ importedClustersStats.numClusters }}</li>
                    <li>Systems count: {{ importedClustersStats.numSystems }}</li>
                    <li>Default cluster: ({{ importedClustersStats.currentClusterId }}) -
                      {{ importedClustersStats.currentClusterName }}
                    </li>
                  </ul>
                  <div class="control-group">
                    <button type="button" class="cancel-data" @click="cancelImport">
                      <div class="action">Cancel import</div>
                    </button>
                    <button type="button" class="apply-data" :disabled="! fileSelected" @click="applyImport">
                      <div class="action">Apply file "{{importFile.name}}"</div>
                    </button>
                  </div>
                </div>
                <div v-else="importFile" class="note">Imported file information will appear here.</div>
              </div>
            </div>
          </section>
        </section>
      </main>
    </template>
  </InfoPageLayout>
</template>

<style scoped>

main {
  display: flex;
  flex-direction: column;
  justify-content: space-around;
}

main section {
  margin: 1rem;
}

h2, h3 {
  font-weight: bold;
}

h3 {
  font-size: 1.1rem;
}

.actions {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
}

.import-export {
  width: 100%;
}

.control-group {
  margin: 0.5rem 1rem;
  display: flex;
  flex-direction: row;
  justify-content: space-around;
}


.control-group-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  width: 100%;
}

.import-actions {
  width: 100%;
}

button .action {
  font-weight: bold;
}


</style>
