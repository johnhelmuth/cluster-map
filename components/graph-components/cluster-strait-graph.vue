<script setup lang="ts">

import type {MapViewStylesType} from "~/types/BasicTypes";
import {type ClusterModelInterface, DEFAULT_GALACTIC_DIRECTION, galacticDirectionOpposites} from "~/types/ClusterTypes";
import type {DrawDirectionType, StraitModelInterface} from "~/types/StraitTypes";
import {getQuadrant, type ViewBoxType} from "@/utils/geometry";
import {curveCubic, pathStraight} from '@/utils/svg-utils';
import {useUserScopeStore} from "~/stores/use-user-scope-store";

const props = defineProps<{
  clusterStrait: StraitModelInterface,
  cluster: ClusterModelInterface,
  viewBoxValues: ViewBoxType
  index: number,
  debug: boolean,
  mapStyle: MapViewStylesType,
  shouldRotate: boolean,
}>();

const { routePlannerService } = useUserScopeStore();

const straitOriginInCluster = computed(() => {
  return props.clusterStrait.straitPointA.cluster.id == props.cluster.id
})

const system = computed(() => {
  if (props.clusterStrait) {
    const originInCluster = straitOriginInCluster.value;
    if (originInCluster) {
      return props.clusterStrait.straitPointA.system;
    }
    return props.clusterStrait.straitPointB.system;
  }
});

const sysPos = computed(() => system.value?.getPosition(props.mapStyle, props.shouldRotate))

const viewGalacticDirection = computed(() => {
  return straitOriginInCluster.value ? props.clusterStrait.galacticDirection : galacticDirectionOpposites[props.clusterStrait.galacticDirection || DEFAULT_GALACTIC_DIRECTION];
})

const offScreenPosition = computed(() => {
  const pos = {x: 0, y: 0, graphEdgeX: 0, graphEdgeY: 0};
  const { x: counterspinwardEdge, y: corewardEdge, width: spinwardEdge, height: rimwardEdge} = props.viewBoxValues;
  switch (viewGalacticDirection.value) {
    case 'coreward':
      if (sysPos.value?.x) {
        pos.x = pos.graphEdgeX = sysPos.value.x;
        pos.graphEdgeY = (corewardEdge || 0);
        pos.y = pos.graphEdgeY - 1000;
      }
      break;
    case 'spinward':
      if (sysPos.value?.y) {
        pos.graphEdgeX = (spinwardEdge || 1000);
        pos.x = pos.graphEdgeX + 1000;
        pos.y = pos.graphEdgeY = sysPos.value.y || 0;
      }
      break;
    case 'rimward':
      if (sysPos.value?.x) {
        pos.x = pos.graphEdgeX = sysPos.value.x;
        pos.graphEdgeY = (rimwardEdge || 1000);
        pos.y = pos.graphEdgeY + 1000;
      }
      break;
    case 'counterspinward':
      if (sysPos.value?.y) {
        pos.graphEdgeX = (counterspinwardEdge || 0);
        pos.x = pos.graphEdgeX - 1000;
        pos.y = pos.graphEdgeY = sysPos.value.y || 0;
      }
      break;
  }
  return pos;
})

function curveParamsByQuadrant(curveFudge: number) {
  let curveDirection: DrawDirectionType = 'center';
  const quadrant = getQuadrant(sysPos.value || { x: 0, y: 0 }, props.viewBoxValues);
  switch (viewGalacticDirection.value) {
    case 'coreward':
      if (quadrant === 1) {
        curveDirection = 'counterclockwise';
      } else if (quadrant === 2) {
        curveDirection = 'clockwise';
      } else if (quadrant === 3) {
        curveDirection = 'clockwise';
        curveFudge *= 2;
      } else { // quadrant === 4
        curveDirection = 'counterclockwise';
        curveFudge *= 2;
      }
      break;
    case 'spinward':
      if (quadrant === 1) {
        curveDirection = 'clockwise';
      } else if (quadrant === 2) {
        curveDirection = 'clockwise';
        curveFudge *= 2;
      } else if (quadrant === 3) {
        curveDirection = 'counterclockwise';
        curveFudge *= 2;
      } else { // quadrant === 4
        curveDirection = 'counterclockwise';
      }
      break;
    case 'rimward':
      if (quadrant === 1) {
        curveDirection = 'clockwise';
        curveFudge *= 2;
      } else if (quadrant === 2) {
        curveDirection = 'counterclockwise';
        curveFudge *= 2;
      } else if (quadrant === 3) {
        curveDirection = 'counterclockwise';
      } else { // quadrant === 4
        curveDirection = 'clockwise';
      }
      break;
    case 'counterspinward':
      if (quadrant === 1) {
        curveDirection = 'counterclockwise';
        curveFudge *= 2;
      } else if (quadrant === 2) {
        curveDirection = 'counterclockwise';
      } else if (quadrant === 3) {
        curveDirection = 'clockwise';
      } else { // quadrant === 4
        curveDirection = 'clockwise';
        curveFudge *= 2;
      }
      break;
  }
  return { curveDirection, curveFudge};
}

const straitCurve = computed(() => {

  const { upperLeft, lowerRight } = props.cluster.boundingBox;
  let curveRadius = Math.max(lowerRight.x - upperLeft.x, lowerRight.y - upperLeft.y) / 4;

  const {curveDirection, curveFudge } = curveParamsByQuadrant(1.2);

  curveRadius *= curveFudge;
  return {curveDirection, curveRadius};
})

const directionLabelPosition = computed(() => {
  const { width: spinwardEdge } = props.viewBoxValues;

  const sysPosition = sysPos.value;
  const offscrPosition = offScreenPosition.value;
  const graphEdgePosition = {
    x: offscrPosition.graphEdgeX,
    y: offscrPosition.graphEdgeY,
  };
  const distFromEdge = 12;
  const distFromStrait = 20;
  const textHeightFudge = 0;
  const textWidthFudge = 8 * ((viewGalacticDirection.value?.length || 0) + 3);
  const offsets = {x: 0, y: 0};
  const textWidthOffsets = {x: 0, y: 0};
  switch (viewGalacticDirection.value) {
    case 'coreward':
      offsets.y = distFromEdge + textHeightFudge;
      offsets.x = distFromStrait;
      if (sysPosition) {
        const startPosDistFromEdgeX = (spinwardEdge || 1000) - sysPosition.x;

        // If too close to the right edge of map, move it to other side of strait line.
        if (startPosDistFromEdgeX < textWidthFudge) {
          offsets.x = -distFromStrait
          textWidthOffsets.x = -(textWidthFudge);
        }
      }
      break;
    case 'counterspinward':
      offsets.x = distFromEdge;
      offsets.y = -distFromStrait;
      break;
    case 'rimward':
      offsets.y = -distFromEdge - textHeightFudge;
      offsets.x = distFromStrait;
      if (sysPosition) {
        if (sysPosition.x > ((spinwardEdge || 1000) - textWidthFudge)) {
          const startPosDistFromEdgeX = (spinwardEdge || 1000) - sysPosition.x;
          // If too close to the right edge of map, move it to other side of strait line.
          if (startPosDistFromEdgeX < textWidthFudge) {
            offsets.x = -distFromStrait
            textWidthOffsets.x = -(textWidthFudge);
          }
        }
      }
      break;
    case 'spinward':
      offsets.x = -distFromEdge - textWidthFudge;
      offsets.y = -distFromStrait;
      if (sysPosition) {
        if (sysPosition.x > ((spinwardEdge || 1000) - textWidthFudge)) {
          textWidthOffsets.x = -textWidthFudge;
        }
      }
  }
  return {
    x: graphEdgePosition.x + offsets.x + textWidthOffsets.x,
    y: graphEdgePosition.y + offsets.y + textWidthOffsets.y,
  };
})

const otherSystemName = computed(() => {
  if (props.clusterStrait) {
    const originInCluster = straitOriginInCluster.value;
    if (originInCluster) {
      return props.clusterStrait.straitPointB.system.name;
    }
    return props.clusterStrait.straitPointA.system.name;
  }
})

const straitPath = computed(() => {
  if (sysPos.value) {
    const { curveDirection, curveRadius } = straitCurve.value;

    let path: string;
    if (curveDirection !== 'center') {
      path = curveCubic(sysPos.value, offScreenPosition.value, curveRadius, curveDirection);
    } else {
      path = pathStraight(sysPos.value, offScreenPosition.value);
    }
    return path;
  }
})

function handleClick(e: MouseEvent) {
  if (props.clusterStrait) {
    let clusterSlug: string;
    const originInCluster = straitOriginInCluster.value;
    if (originInCluster) {
      clusterSlug = props.clusterStrait.straitPointB.cluster.slug;
    } else {
      clusterSlug = props.clusterStrait.straitPointA.cluster.slug;
    }
    if (clusterSlug) {
      navigateTo({name: 'map-clusterSlug', params: {clusterSlug}})
    }
  }
}

const isInRoutePlan = computed(() => routePlannerService.straitInRoutePlan(props.clusterStrait))
</script>

<template>
  <g class="cluster-strait"  @click="handleClick" :class="{'in-route-plan' : isInRoutePlan}">
    <path class="main" :d="straitPath" fill="none"/>
    <path class="selected" :d="straitPath" fill="none"/>
    <text class="cluster-strait-direction"
          :x="directionLabelPosition.x"
          :y="directionLabelPosition.y"
    >to {{ otherSystemName }}
    </text>
<!--    <text class="cluster-strait-direction"-->
<!--          :x="directionLabelPosition.x"-->
<!--          :y="directionLabelPosition.y + 20"-->
<!--      >{{ viewGalacticDirection }}</text>-->
  </g>
</template>

<style scoped>
.cluster-strait .main {
  stroke: var(--color-highlight2);
  stroke-width: 1rem;
  filter: blur(.25rem);
  cursor: pointer;
}
.cluster-strait.in-route-plan .main {
  stroke-width: 1.25rem;
}

.cluster-strait .selected {
  display: none;
}

.cluster-strait.in-route-plan .selected {
  display: block;
  stroke-width: 0.675rem;
  stroke: hsl(180, 100%, 100%, 80%);
  filter: blur(4px);
  animation: 1s ease-in-out 0.1s infinite alternate cluster-strait-throb;
}

@keyframes cluster-strait-throb {
  from {
    stroke-width: 0.5rem;
  }
  to {
    stroke-width: 1rem;
  }
}

.cluster-strait-direction {
  fill: lightblue;
  font-size: .75rem;
  cursor: pointer;
}
</style>