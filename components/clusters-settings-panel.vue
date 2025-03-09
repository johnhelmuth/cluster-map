<script setup lang="ts">

import {useUniversesStore} from "~/stores/use-universes-store";
import {useUserScopeStore} from "~/stores/use-user-scope-store";
import type {Ref} from "vue";
import {getParseUniverse} from "~/utils/import-validator";
import type {ClusterIdType, UniverseIdType, UniverseModelDataType} from "~/types/ClusterTypes";
import {isUniverseModelDataType} from "~/utils/utils";

const universesStore = useUniversesStore();

const {routePlannerService, selectedSystemsService} = useUserScopeStore();

const {open, reset, onChange} = useFileDialog({
  accept: 'application/json', // Set to accept only JSON files
})

const importFile: Ref<File | null> = ref(null);

const importedData: Ref<UniverseModelDataType | object> = ref({});
const importError: Ref<string | undefined> = ref(undefined);

const importPanelClosed = ref(true);
const iconExpandedName = 'material-symbols:expand-all-rounded'
const iconCollapsedName = 'material-symbols:collapse-all-rounded'
const expandCollapseIcon = ref(iconExpandedName);

function expandPanel() {
  importPanelClosed.value = !importPanelClosed.value;
  expandCollapseIcon.value = importPanelClosed.value ? iconExpandedName : iconCollapsedName;
}

const parseUniverse = getParseUniverse();

const fileSelected = computed(() => !!importFile.value);

const importedUniverseStats = computed(() => {
  const stats : {
    numClusters?: number,
    numSystems?: number,
    universeId?: UniverseIdType,
    description?: string,
    currentClusterId?: ClusterIdType,
    currentClusterName?: string,
  } = {
    numClusters: undefined,
    numSystems: undefined,
    universeId: undefined,
    description: undefined,
    currentClusterId: undefined,
    currentClusterName: undefined,
  };
  if (importedData.value && isUniverseModelDataType(importedData.value)) {
    const importedDataRaw: UniverseModelDataType = importedData.value;
    if (importedDataRaw?.id) {
      stats.universeId = importedDataRaw.id;
    }
    if (importedDataRaw?.description) {
      stats.description = importedDataRaw.description;
    }
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

function exportData() {
  downloadJSON(universesStore.value.universe, 'universes.json');
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

function updateUniverse(data: UniverseModelDataType | object) {
  if (data && isUniverseModelDataType(data)) {
    routePlannerService.deleteAllRoutePlans();
    selectedSystemsService.deleteAllSelectedSystems();
    universesStore.value.universe.parseUniverseData(data);
  }
}

onChange((files) => {
  if (files) {
    importFile.value = files[0];
  }
  importError.value = undefined;
})

function applyImport() {
  updateUniverse(importedData.value);
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
      const parsedUniverse = parseUniverse(importedJSON);
      if (parsedUniverse.valid) {
        importedData.value = parsedUniverse.value as UniverseModelDataType;
        importError.value = undefined;
      } else {
        throw new Error(parsedUniverse.error);
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
              <span class="action">Import</span>
            </button>
          </div>
          <div>
            <button @click="exportData">
              <span class="action">Export</span>
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
                <li>Universe Id: {{ importedUniverseStats.universeId }}</li>
                <li>Description: {{ importedUniverseStats.description }}</li>
                <li>Clusters count: {{ importedUniverseStats.numClusters }}</li>
                <li>Systems count: {{ importedUniverseStats.numSystems }}</li>
                <li>Default cluster: ({{ importedUniverseStats.currentClusterId }}) -
                  {{ importedUniverseStats.currentClusterName }}
                </li>
              </ul>
              <div class="control-group">
                <button type="button" class="cancel-data" @click="cancelImport">
                  <span class="action">Cancel import</span>
                </button>
                <button type="button" class="apply-data" :disabled="! fileSelected" @click="applyImport">
                  <span class="action">Apply file "{{ importFile.name }}"</span>
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