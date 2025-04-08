<script setup lang="ts">

import {useUniverseStore} from "~/stores/use-universe-store";
import {useUserScopeStore} from "~/stores/use-user-scope-store";
import type {Ref} from "vue";
import {type UniverseModelData, isUniverseModelData} from "~/models/UniverseModel";
import type {ClusterIdType} from "~/models/ClusterModel";
import {universeJSONParse, universeParse, createSchemaValidationError} from "~/utils/import-validator";

const universeStore = useUniverseStore();

const {routePlannerService, selectedSystemsService} = useUserScopeStore();

const {files, open, reset, onChange} = useFileDialog({
  accept: 'application/json', // Set to accept only JSON files
})

const importFile: Ref<File | null> = ref(null);

const importedData: Ref<UniverseModelData | object> = ref({});
const importError: Ref<string | undefined> = ref(undefined);

const importPanelClosed = ref(true);
const iconExpandedName = 'material-symbols:expand-all-rounded'
const iconCollapsedName = 'material-symbols:collapse-all-rounded'
const expandCollapseIcon = ref(iconExpandedName);

function expandPanel() {
  importPanelClosed.value = !importPanelClosed.value;
  expandCollapseIcon.value = importPanelClosed.value ? iconExpandedName : iconCollapsedName;
}

const fileSelected = computed(() => !!importFile.value);

const importedClustersStats = computed(() => {
  const stats: {
    numClusters?: number,
    numSystems?: number,
    currentClusterId?: ClusterIdType,
    currentClusterName?: string,
  } = {
    numClusters: undefined,
    numSystems: undefined,
    currentClusterId: undefined,
    currentClusterName: undefined,
  };
  if (importedData.value && isUniverseModelData(importedData.value)) {
    const importedDataRaw: UniverseModelData = importedData.value;
    if (importedDataRaw?.clusters && importedDataRaw?.clusters.hasOwnProperty('length')) {
      stats.numClusters = importedDataRaw.clusters.length;
      let systemCount = 0;
      for (const cluster of importedDataRaw.clusters) {
        if (cluster?.systems && cluster.systems.hasOwnProperty('length') && cluster.systems.length) {
          systemCount += (cluster.systems.length || 0);
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

function exportData(e: Event) {
  downloadJSON(universeStore.clusters, 'universes.json');
}

function downloadJSON(data: any, filename: string) {
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

function updateClusters(data: UniverseModelData | object) {
  if (data && isUniverseModelData(data)) {
    routePlannerService.deleteAllRoutePlans();
    selectedSystemsService.deleteAllSelectedSystems();
    universeStore.clusters.parseUniverseData(data);
  }
}

onChange((files) => {
  if (files) {
    importFile.value = files[0];
  }
  importError.value = undefined;
})

function applyImport() {
  updateClusters(importedData.value);
  resetImports();
  reset();
}

function cancelImport() {
  resetImports();
  reset();
}

function resetImports() {
  importedData.value = {};
  importFile.value = null;
  // TODO: Implement a global popup/toaster component to handle this type of error.
  setTimeout((() => importError.value = undefined), 7000);
}

watch(importFile, async () => {
  let importedJSON: string | undefined = undefined;
  if (importFile.value) {
    try {
      importedJSON = await importFile.value.text();
      let valid = false;
      if (importedJSON) {
        const clustersData = JSON.parse(importedJSON);
        if (isUniverseModelData(clustersData)) {
          importedData.value = clustersData;
          importError.value = undefined;
          valid = true;
        }
      }
      if (! valid) {
        const parsedResponse = universeJSONParse(importedJSON);
        if (!parsedResponse.valid) {
          throw createSchemaValidationError(parsedResponse, 'ClustersSettingPanel import file selected, invalid cluster data imported. ');
        }
      }
    } catch (err) {
      console.error(err);
      if (err instanceof Object && "message" in err && typeof err.message === "string") {
        importError.value = err.message;
      } else if (typeof err === "string") {
        importError.value = err;
      } else {
        importError.value = "Unknown error during import of universes.";
      }
      resetImports();
    }
  } else {
    resetImports();
  }
});

</script>

<template>
  <div class="clusters-settings-panel">
    <section class="import-export accordion-control">
      <h3 @click="expandPanel">Import / Export
        <Icon class="button-icon accordion-button"
              :name="expandCollapseIcon"/>
      </h3>
      <div class="accordion-panel note" :class="{ open: ! importPanelClosed}">
        <p>Import/export data for all clusters from or to JSON</p>
        <div class="control-group control-group-grid data-import-export">
          <div>
            <button type="button" class="import-data" :class="fileSelected ? 'file-selected' : ''"
                    :disabled="fileSelected" @click="open()">
              <div class="action">Import</div>
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
            <h4>Import file</h4>
            <div v-if="importFile && importedData && ! importError" class="import-file-apply">
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
                  <div class="action">Apply file "{{ importFile.name }}"</div>
                </button>
              </div>
            </div>
            <div v-else-if="importError" class="error">{{ importError }}</div>
            <div v-else class="note">
              <p>Information about the selected file to be imported will appear here.</p>
              <p>You can cancel or import the selected file after reviewing the information.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>

.clusters-settings-panel {
  border: 1px solid var(--color-border);
  border-radius: 1rem;
  padding: 0.5rem 1rem;
  overflow-y: auto;
}

.import-export {
  width: 100%;
}

section.accordion-control h3 {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0;
}

.accordion-panel {
  display: none;
}
.accordion-panel.open {
  display: block;
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

.note {
  font-size: 0.75rem;
}

.error {
  color: red;
  font-weight: bold;
}

</style>