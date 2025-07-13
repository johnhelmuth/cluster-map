<script setup lang="ts">

import {attributeRatingDescriptors, attributesMeta} from '@/utils/attributes-meta';

const showBox = ref(false);

function toggleBox() {
  showBox.value = !showBox.value;
}

const legendIdList = Object.keys(attributesMeta) as Array<keyof typeof attributesMeta>;
const legendTabId = ref('technology' as keyof typeof attributeRatingDescriptors);

function toggleLegendTab(newLegendId: keyof typeof attributesMeta) {
  legendTabId.value = newLegendId;
}

</script>

<template>
  <div class="map-legend">
    <div class="map-legend-button" @click="toggleBox" v-if="! showBox">Legend</div>
    <div class="map-legend-box" v-if="showBox">
      <div class="map-legend-tab-control">
        <template v-for="legendId of legendIdList">
          <span class="map-legend-tab-label" :class="legendId === legendTabId ? 'active' : ''"
                @click="toggleLegendTab(legendId)">
            {{ attributesMeta[legendId].name }}
          </span>
        </template>
      </div>
      <div class="map-legend-list-container">
        <div class="map-legend-header-container">
          <span class="map-legend-header">Map Legend</span>
          <Icon name="material-symbols:close-rounded" class="legend-close-icon" @click="toggleBox"/>
        </div>
        <template v-for="legendId of legendIdList">
          <ul class="map-legend-list" :class="legendId" v-if="legendTabId === legendId" :key="legendId">
            <li v-for="[rating, attributeData] of attributeRatingDescriptors[legendId].entries()"
                :title="attributeData?.note"
            >
              <span :class="['attribute-rating', 'rating_'+rating.toString()]">{{ rating }}</span>
              <div class="attribute-name">
                <span v-if="legendTabId === 'environment'" class="attribute-color"
                     :style="`background-color: ${attributeData?.color ? attributeData.color : 'inherit'}`"
                ></span>
                <span class="attribute-name">
                  {{ attributeData.name }}&nbsp;{{ attributeData.note }}
                </span>
              </div>
            </li>
          </ul>
        </template>
      </div>
    </div>
  </div>
</template>

<style scoped>
.map-legend {
  position: absolute;
  bottom: 0.4rem;
  right: 0.4rem;
}

.map-legend-button {
  position: absolute;
  right: 0.4rem;
  bottom: 0.4rem;
  font-size: 0.75rem;
  color: white;
  cursor: pointer;
  border: 0.2rem solid var(--color-border);
}

.legend-close-icon {
  position: absolute;
  top: 2rem;
  right: 0.4rem;
}

.map-legend-box {
  width: 30rem;
  background-color: transparent;
}

@container (width < 31rem) {
  .map-legend-box {
    width: 95cqw;
  }
  .map-legend-box .map-legend-tab-label {
    font-size: 0.70rem;
  }
  .map-legend-box ul.map-legend-list li {
    font-size: 0.75rem;
  }
}

@container (width < 24.5rem) {
  .map-legend-box .map-legend-tab-label {
    font-size: 0.60rem;
  }
  .map-legend-box ul.map-legend-list li {
    font-size: 0.65rem;
  }
}

.map-legend-tab-label {
  text-align: center;
  font-size: 0.75rem;
  background-color: var(--color-background-mute);
  padding: 0.25rem .5rem;
  border-start-start-radius: 0.5rem;
  border-start-end-radius: 0.5rem;
  border: 1px solid var(--color-border);
  box-shadow: 2px 0 5px var(--color-text);
}

.map-legend-tab-label.active {
  background-color: var(--color-background);
}

.map-legend-list-container {
  background-color: var(--color-background);
  border-start-end-radius: 0.5rem;
  border-end-end-radius: 0.5rem;
  border-end-start-radius: 0.5rem;
  box-shadow: 2px 2px 5px var(--color-text);
}

.map-legend-header-container {
  display: flex;
  flex-direction: row;
  justify-content: center;
  padding: 0.5rem;
}

ul.map-legend-list {
  list-style-type: none;
  padding: 0 0.5rem 0.5rem;
  display: grid;
  grid-template-columns: 1fr 12fr;
  gap: 0;
}


ul.map-legend-list li {
  display: grid;
  grid-column: 1 / -1;
  grid-template-columns: subgrid;
  font-size: 1rem;
  justify-items: center;
  align-items: center;
}

ul.map-legend-list li span.attribute-rating {
  text-align: center;
  grid-column: 1 / 2;
}

ul.map-legend-list li div.attribute-name {
  padding: 0 0.25rem;
  grid-column: 2 / -1;
  display: flex;
  align-items: center;
  flex-direction: row;
  column-gap: 0.5rem;
  width: 100%;
}

ul.map-legend-list.environment li div.attribute-name span.attribute-color {
  width: 1rem;
  height: 1rem;
  margin-left: 0.125rem;
}

</style>