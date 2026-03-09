<script setup lang="ts">

import {DrawDirectionList, type DrawDirectionType} from "~/types/StraitTypes";
import TestCurveCubic from "~/components/graph-components/test-curve-cubic.vue";
import TestCurveQuadratic from "~/components/graph-components/test-curve-quadratic.vue";
import {getCubicParameters, getQuadControlPoint} from "~/utils/geometry";

const lineList = computed(() => {
  const startLine = {a: {x: 100, y: 250}, b: {x: 400, y: 250}, angle: 0}
  const center = {x: 250, y: 250};
  const lines = [];
  const numTests = 6;
  const angleStep = (Math.PI * 2) / numTests;
  for (let index = 0, angle = 0; index < numTests; index++, angle += angleStep) {
    const a = rotateAroundPosition(startLine.a, center, angle);
    const b = rotateAroundPosition(startLine.b, center, angle);
    const { normalAngle, midPoint } = lineDetails(a, b);
    const quadControlPoint = getQuadControlPoint(normalAngle, curveRadius.value, midPoint, direction.value);
    const { cubicControlPoint1, cubicControlPoint2 } = getCubicParameters(a, b, curveRadius.value, direction.value);
    const cp1 = curveType.value === 'quadratic' ? quadControlPoint : cubicControlPoint1;
    const cp2 = curveType.value === 'quadratic' ? {x: 0, y: 0} /* Not used in component */ : cubicControlPoint2;
    lines.push({a, cp1, cp2, b, angle});
  }
  return lines
})

const curveRadius = ref(100);
const direction = ref('counterclockwise' as DrawDirectionType);
const curveType = ref('cubic' as 'cubic' | 'quadratic');
const testCubicIntersect = ref(true);
const iLine = ref<LineType>([{x: 65, y: 440}, {x: 400, y: 25}]);
const curveTypeComponent = computed(() => {
  if (curveType.value === 'quadratic') {
    return TestCurveQuadratic;
  } else {
    return TestCurveCubic;
  }
})

</script>

<template>
  <div class="test-curve-wrapper">
    <div class="test-controls">
      <label>
        Curve direction:
        <select v-model="direction">
          <option v-for="direction in DrawDirectionList" :value="direction">{{ direction }}</option>
        </select>
      </label>
      <label>
        Curve type:
        <select v-model="curveType">
          <option value="cubic">Cubic</option>
          <option value="quadratic">Quadratic</option>
        </select>
      </label>
      <label>
        Curve radius:
        <select v-model="curveRadius">
          <option v-for="r in 20" :value="r*20">{{ r*20 }}</option>
        </select>
      </label>
      <label>
        Intersect cubic lines&nbsp;
        <input type="checkbox" v-model="testCubicIntersect" :disabled="curveType === 'quadratic'" />
      </label>
    </div>
    <div class="svg-container" v-for="({a, b, cp1, cp2, angle}) in lineList">
      <ClientOnly>
        <component :is="curveTypeComponent"
                   :curve="[a, cp1, cp2, b]"
                   :i-line="iLine"
                   :curveRadius="curveRadius"
                   :direction="direction"
                   :test-intersect="testCubicIntersect">
          <template #extraLabel>
            <p>Line rotation: {{ (angle * 180 / Math.PI).toFixed(2) }} degrees</p>
            <p>Curve type: {{ curveType }}</p>
          </template>
        </component>
      </ClientOnly>
    </div>
  </div>
</template>

<style scoped>
.test-curve-wrapper {
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-auto-rows: auto;
  grid-gap: 2rem;
}

.test-controls {
  grid-area: 1 / 1 / -1 / -1;
  display: flex;
  flex-direction: row;
  gap: 2rem;
  margin: auto 3rem;
}

.svg-container {
  padding: 0 2rem;
  width: 100%;
}
</style>