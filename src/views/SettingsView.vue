<script setup lang="ts">
import InfoPageLayout from "@/layouts/InfoPageLayout.vue";
import {inject} from "vue";

const cluster = inject("cluster");

function exportData(e : Event) {
  console.log('exportData() click.');
  downloadJSON(cluster, 'cluster.json');

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

function importData(e: Event) {
  console.log('importData() click.');
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
          <section class="actions import-export">
            <h3>Import / Export</h3>
            <p>Import or export all cluster data from or to JSON</p>
            <div class="control-group">
              <button @click="importData">
                <div class="action">Import</div>
                <div class="note">Not implemented yet.</div>
              </button>
              <button @click="exportData">
                <div class="action">Export</div>
              </button>
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

.control-group {
  margin: 0.5rem 1rem;
  width: 50%;
  display: flex;
  flex-direction: row;
  justify-content: space-around;
}

button .action {
  font-weight: bold;
}
button .note {
  font-size: 0.5rem;
}
</style>
