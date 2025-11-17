<script setup lang="ts">
import { isInViewport } from '@/utils/utils';

const route = useRoute()

const {data: sessions} = await useAsyncData(route.path, async () => {
  const data = await queryCollection('content')
      .select('id', 'title', 'description', 'path', 'meta', 'in_game_start', 'in_game_end')
      .where('path', 'LIKE', '/sessions/%')
      .where('path', 'NOT LIKE', '/sessions/%/%')
      .order('in_game_start', 'ASC')
      .all()
  ;
  return data;
});

onMounted(() => {
  if (import.meta.client) {
    const lastSummaryEl = document.querySelector('.info-content ul li:last-child') as HTMLElement;
    if (lastSummaryEl && ! isInViewport(lastSummaryEl)) {
      lastSummaryEl.scrollIntoView({behavior: 'smooth'});
    }
  }
});

function uitDate(uitDateTime: string): string {
  return uitDateTime.split(" ")?.[0] || '';
}

function uitTime(uitDateTime: string): string {
  return uitDateTime.split(" ")?.[1] || '';
}

function isSameDate(uitDateTimeA: string, uitDateTimeB: string): boolean {
  return uitDate(uitDateTimeA) === uitDate(uitDateTimeB);
}

function showStartDate(sessionIndex: number) {
  if (sessionIndex === 0) {
    return true;
  }
  if (! sessions.value || sessions.value.length < 1) {
    return false;
  }
  return ! isSameDate(sessions.value[sessionIndex].in_game_start, sessions.value[sessionIndex-1].in_game_end)
}

function showStartTime(sessionIndex: number) {
  if (sessionIndex === 0) {
    return true;
  }
  if (! sessions.value || sessions.value.length < 1) {
    return false;
  }
  return sessions.value[sessionIndex].in_game_start !== sessions.value[sessionIndex-1].in_game_end;
}
function showEndDate(sessionIndex: number) {
  if (! sessions.value || sessions.value.length < 1) {
    return false;
  }
  const len = sessions.value.length;
  if (sessionIndex >= len-1) {
    return true;
  }
  return ! isSameDate(sessions.value[sessionIndex].in_game_end, sessions.value[sessionIndex].in_game_start)
    && isSameDate(sessions.value[sessionIndex].in_game_end, sessions.value[sessionIndex+1].in_game_start);
}

function showEndTime(sessionIndex: number) {
  if (! sessions.value || sessions.value.length < 1) {
    return false;
  }
  return true;
}
</script>

<template>
  <InfoPage page_title="Sessions">
    <ul v-if="sessions && sessions.length > 0">
      <li key="header" class="header">
        <div class="session-title">Title</div>
        <div class="session-date">Session Date</div>
        <div class="session-game-range">In Game Time Range</div>
        <div class="session-description">Description</div>
      </li>
      <li v-for="(session, index) in sessions" :key="session.id">
        <div class="session-title">
          <NuxtLink :to="session.path">{{ session.title }}</NuxtLink>
        </div>
        <div class="session-date">{{ session.meta.date }}</div>
        <div v-if="showStartDate(index) || showStartTime(index)" class="session-game-datetime session-game-start">
          <span v-if="showStartDate(index)" class="game-date">{{ uitDate(session.in_game_start) }}</span>
          <span v-if="showStartTime(index)" class="game-time">{{ uitTime(session.in_game_start)}}</span>
        </div>
        <div v-if="showEndDate(index) || showEndTime(index)" class="session-game-datetime session-game-end">
          <span v-if="showEndDate(index)" class="game-date">{{ uitDate(session.in_game_end) }}</span>
          <span v-if="showEndTime(index)" class="game-time">{{ uitTime(session.in_game_end)}}</span>
        </div>
        <div class="session-description">{{ session.description }}</div>
      </li>
    </ul>
  </InfoPage>
</template>

<style scoped>

:deep(.info-content) {
  background-color: var(--color-background-mute)

}
ul {
  padding-inline-start: 0;
  --vert-line-start-percent: 94.40%;
  --vert-line-end-percent: 94.65%;
  --bg-transp: #ffffff00;
  --line-color: var(--color-border);
  background-image: linear-gradient(90deg, var(--bg-transp), var(--bg-transp) var(--vert-line-start-percent), var(--line-color) var(--vert-line-start-percent), var(--line-color) var(--vert-line-end-percent), var(--bg-transp) var(--vert-line-end-percent));
}

li {
  list-style-type: none;
  display: grid;
  grid-template-areas:
     "title-link  session-date game-time-start"
     "description description  ."
     "description description  game-time-end";
  grid-template-columns: 2fr 7rem 9rem;
  grid-row-gap: 0.25rem;
  grid-column-gap: 0.25rem;
  font-size: 0.75rem;
  text-align: center;
  margin-bottom: 0.75rem;
  justify-content: center;
  background-color: hsl(from var(--color-background-soft) h s l / 40%);
  border: none;
  border-radius: 0.33rem;
}

li div {
  padding: 0.5rem;
  background-color: var(--color-background);
  border-radius: 0.33rem;
}

li.header div {
  margin-bottom: 0;
}

li div.session-title {
  grid-area: title-link;
  text-align: center;
}

li div.session-date {
  grid-area: session-date;
}

li div.session-game-datetime {
  display: grid;
  grid-template-areas: "date time";
  grid-template-columns: 1fr 1fr;
}
li div.session-game-datetime .game-date {
  grid-area: date;
  justify-self: end;
}
li div.session-game-datetime .game-time {
  grid-area: time;
  justify-self: start;
  margin-left: 0.25rem;
}

li div.session-game-start {
  grid-area: game-time-start;
  text-align: center;
}

li div.session-game-end {
  grid-area: game-time-end;
}

li div.session-description {
  grid-area: description;
  text-align: left;
}
</style>