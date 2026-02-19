<script setup lang="ts">

import type {pointData} from "~/utils/chart-utils";

const props = defineProps<{
  show: boolean;
  position?: { x: number; y: number };
  datum?: pointData;
}>();

watch(props, () => {
  if (! props.show) {
    datumPopoverEl.value?.hidePopover();
  } else if (typeof props.datum !== 'undefined') {
    renderPopover(props.datum)
  }
});

const datumPopoverEl = useTemplateRef('datum-popover');
const datumPopoverLabelEl = useTemplateRef('datum-popover-label');
const datumPopoverValueEl = useTemplateRef('datum-popover-value');
const datumPopoverPercentageEl = useTemplateRef('datum-popover-percentage');

function renderPopover(p: pointData) {
  if (datumPopoverEl.value
      && datumPopoverLabelEl.value
      && datumPopoverValueEl.value
      && datumPopoverPercentageEl.value
      && props.position?.x
      && props.position?.y
  ) {
    const { x: mx, y: my } = props.position;
    datumPopoverLabelEl.value.innerText = p.label.toString();
    datumPopoverValueEl.value.innerText = p.value.toString();
    datumPopoverPercentageEl.value.innerText = p.percentage.toFixed(2) + '%';
    datumPopoverEl.value.style.left = `calc(${mx}px + 1.5rem)`;
    datumPopoverEl.value.style.top = `${my}px`;
    datumPopoverEl.value.showPopover();
  }
}

</script>

<template>
  <div class="datum-popover-container" ref="datum-popover" popover>
    <ul class="datum-popover">
      <li>
        <span>Result:</span><span class="datum-popover-label" ref="datum-popover-label"></span>
      </li>
      <li>
        <span>Count:</span><span class="datum-popover-value" ref="datum-popover-value"></span>
      </li>
      <li>
        <span>&nbsp;</span><span>(<span class="datum-popover-percentage" ref="datum-popover-percentage"></span>)</span>
      </li>
    </ul>
  </div>
</template>

<style scoped>


.datum-popover-container {
  min-width: fit-content;
  min-height: fit-content;
  border: none;
  padding: 0;
  background-color: transparent;
}
ul.datum-popover {
  border: 1px solid var(--color-border);
  list-style-type: none;
  padding: .5rem;
  margin: 0;
  display: grid;
  grid-template-columns: max-content max-content;
  gap: 0.25rem;
  background-color: var(--color-background);
  border-radius: .5rem;
  box-shadow: .5rem .5rem .5rem var(--color-border);
}

.datum-popover li {
  grid-column: 1 / -1;
  display: grid;
  grid-template-columns: subgrid;
  font-size: .8rem;
}
</style>