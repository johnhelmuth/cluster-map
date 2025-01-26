<script setup lang="ts">


import { useUniversesStore } from "~/stores/use-universes-store";
import type {ClusterIdType, UniverseIdType, UniverseModelDataType} from "@/types/ClusterTypes";
import {useUserScopeStore} from "~/stores/use-user-scope-store";
import type { Ref } from "vue";
import {getParseUniverse} from "~/utils/import-validator";
import {isUniverseModelDataType} from "~/utils/utils";

const universesStore = useUniversesStore();

const {routePlannerService, selectedSystemsService} = useUserScopeStore();

const { files, open, reset, onCancel, onChange } = useFileDialog({
  accept: 'application/json', // Set to accept only JSON files
})

const importFile:Ref<File|null> = ref(null);

const importedData: Ref<UniverseModelDataType | object> = ref({});
const importError: Ref<string | undefined> = ref(undefined);

const parseUniverse = getParseUniverse();

const fileSelected = computed(() => !! importFile.value);

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
    const importedDataRaw : UniverseModelDataType = importedData.value;
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

function exportData(e : Event) {
  downloadJSON(universesStore.value.universe, 'universes.json');
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
  <InfoPage page_title="Settings" max-width-rems="40">

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
          <p>Import or export data for the universe from or to JSON</p>
          <div class="control-group control-group-grid data-import-export">
            <div>
              <button type="button" class="import-data" :class="fileSelected ? 'file-selected' : ''" :disabled="fileSelected" @click="open()">
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
                    <div class="action">Cancel import</div>
                  </button>
                  <button type="button" class="apply-data" :disabled="! fileSelected" @click="applyImport">
                    <div class="action">Apply file "{{importFile.name}}"</div>
                  </button>
                </div>
              </div>
              <div v-else-if="importError" class="error">{{importError}}</div>
              <div v-else class="note">Imported file information will appear here.</div>
            </div>
          </div>
        </section>
      </section>
    </main>
  </InfoPage>
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

</style>
