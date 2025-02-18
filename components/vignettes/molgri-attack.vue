<script setup lang="ts">

const scrollText = "Camera SBAL5 7922-008 ";
const scrollTimestampPrefix = "08:28:";
const startTimestampDeciSecs = 51; // 08:28:05.1
const attackDelayDeciSecs = 24;  // 08:28:07.5
const afterAttackDeciSecs = 25;  // 2.5 seconds after the animation ends.
const scrollEndTimestampDeciSecs = startTimestampDeciSecs + 120; // 08:28:17.1
const scrollTimestampDeciSecs = ref(startTimestampDeciSecs);
let secondsTimer : ReturnType<typeof setInterval>;

let outerContainer: HTMLElement | null = null;
let imgContainer: HTMLElement | null = null;
let imgElement: HTMLImageElement | null = null;
let mogriRoarAudio: HTMLAudioElement | null = null;

onMounted(() => {
  outerContainer = document.querySelector('.outer-container');
  imgContainer = document.querySelector('.zoom-in-out-container');
  imgElement = document.querySelector('.zoom-in-out-container img');
  mogriRoarAudio = new Audio();
  if (mogriRoarAudio.canPlayType("audio/ogg")) {
    mogriRoarAudio.setAttribute("src", "/audio/mogri-roar-loudly-193229.ogg")
  } // If the browser doesn't support ogg, the `mogriRoarAudio?.play()` code below won't run, which it OK.

  // start video timer
  secondsTimer = setInterval(tickVideoScroll, 100);
});

const scrollTimestampSecondsDisplay = computed(() => {
  const seconds = Math.floor(scrollTimestampDeciSecs.value / 10);
  const secondsPadded = `${seconds}`.padStart(2, '0');

  const deciSeconds = (scrollTimestampDeciSecs.value % 10);
  return `${secondsPadded}.${deciSeconds}`;
});

function tickVideoScroll() {
  scrollTimestampDeciSecs.value += 1;
  console.log('tickVideoScroll() scrollTimestampDeciSecs.value: ', scrollTimestampDeciSecs.value);
  if (scrollTimestampDeciSecs.value === startTimestampDeciSecs + attackDelayDeciSecs) {
    openHatch();
  }
  if (scrollTimestampDeciSecs.value >= scrollEndTimestampDeciSecs) {
    clearInterval(secondsTimer);
  }
}

console.log('scrollTimestampPrefix: ', scrollTimestampPrefix);
console.log('scrollTimestampSeconds.value: ', scrollTimestampDeciSecs.value);
console.log('scrollTimestampSecondsDisplay: ', scrollTimestampSecondsDisplay);

// tickVideoScroll();
// setTimeout(tickVideoScroll, 1000);
// setTimeout(tickVideoScroll, 2000);
// setTimeout(tickVideoScroll, 3000);


const openHatch = () => {
  const animTime = 2000;
  if (imgContainer && imgElement) {
    mogriRoarAudio?.play();
    imgContainer.classList.toggle('zoom-in-out');
    imgElement.addEventListener('animationend', () => {
      outerContainer?.classList.add('last-frame');
      if (secondsTimer) {
        setTimeout(() => clearInterval(secondsTimer), afterAttackDeciSecs);
      }
    });
  }
}

</script>

<template>
  <div class="outer-container">
    <div class="zoom-in-out-container" @click="openHatch">
      <img class="molgri-img" src="/images/Molgri.jpg" alt="Molgri">
    </div>
    <img class="hatch-control-panel" src="/images/hatch-control-panel.svg" @click="openHatch" alt="Hatch Control Panel">
    <p v-if="scrollText" class="scroll-container"><span>{{ scrollText }}{{
        scrollTimestampPrefix
      }}{{ scrollTimestampSecondsDisplay }}</span></p>
    <div class="explosion"></div>
  </div>
</template>

<style scoped>

:root {
  font-size: 48px;
}

.outer-container {
  display: flex;
  flex-direction: row;
  justify-content: center;
  position: relative;
  height: 100%;
  background: darkgrey;
  transition: background-color 0.1s;
}
.outer-container div.explosion {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  transform: scale(0);
}

.outer-container.last-frame div.explosion {
  background: radial-gradient(ellipse at 50% 45%, transparent 0%, red 25%, rgb(255,255,255,0.8) 45%, red 65%, black 90%);
  background-size: 100%;
  background-position: center;
  animation-name: explode-from-center;
  animation-duration: 3s;
  border-radius: 50%;
}

.outer-container.last-frame > * {
  display: none;
}

.outer-container.last-frame > div.explosion,
.outer-container.last-frame > p.scroll-container {
  display: block;
}


.outer-container .scroll-container {
  position: absolute;
  top: 0;
  left: 1rem;
  margin-top: 1rem;
  margin-right: 1rem;
  background: #00000030;
}

.outer-container .scroll-container span {
  margin: 0 1rem;
}

.zoom-in-out-container {
  overflow: clip;
  background-color: #b6b6b6;
  margin: 1rem;
  padding: 0;
  border: 0.5rem solid grey;
  border-radius: 2rem;
  width: 50rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.hatch-control-panel {
  margin-left: 2rem;
  width: 10rem;
}

.zoom-in-out-container img {
  margin: 0;
  padding: 0;
  width: 50rem;
  height: 37.5rem;
  transform: scale(0);
}

.zoom-in-out-container.zoom-in-out {
  background-color: black;
}

.zoom-in-out-container.zoom-in-out img {
  background: radial-gradient(ellipse at center, red 0%, red 35%, black 90%);
  animation: 0.1s linear 0s 5 alternate zoom-in-out;
}

@keyframes zoom-in-out {
  from {
    transform: scale(0);
  }
  to {
    transform: scale(2);
  }
}

@keyframes explode-from-center {
  from {
    transform: scale(0);
  }
  to {
    transform: scale(1);
  }
}

</style>