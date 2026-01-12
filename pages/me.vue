<script setup lang="ts">

definePageMeta({
  middleware: ['authenticated'],
});

const {user, fetch: refreshSession, clear} = useUserSession();
const RESENT_MESSAGE_TIMEOUT = 30000; // 30 seconds

const sentMessage = ref('');

async function logout() {
  await clear();
  navigateTo('/');
}

async function resend() {
  sentMessage.value = 'Sending verification email.';
  const result = await $fetch('/api/user/send-verification-email')
  if (result && result.sent) {
    popup('Verification email sent.');
  } else {
    popup('Verification email unsuccessful, please try again later.');
  }
}

function popup(message: string) {
  sentMessage.value = message;
  setTimeout(() => {
        sentMessage.value = '';
      },
      RESENT_MESSAGE_TIMEOUT
  )
}
</script>

<template>
  <InfoPage page_title="Profile page" max-width-rems="50">
    <div v-if="user" class="user-info">
      <div v-if="user.name" class="item-box">
        <div class="item-label">Name:</div>
        <div class="item-value"><span>{{ user.name }}</span></div>
      </div>
      <template v-for="ad of user.authenticationData">
        <div v-if="ad.authType === 'username-password'" class="item-box">
          <div class="item-label">Username:</div>
          <div class="item-value"><span>{{ ad.username }}</span></div>
        </div>
      </template>
      <div class="item-box">
        <div class="item-label">Email verified:</div>
        <div v-if="user.verifiedAt" class="item-value"><span>Yes.</span><span>{{ user.verifiedAt }}</span></div>
        <div v-else class="item-value not-verified">
          <span>No</span>
          <span v-if="! sentMessage" class="resend-button"><button @click="resend">Resend email verification email.</button></span>
          <span v-else class="sent-message">{{ sentMessage }}
            <Spinner class="spinner"/>
          </span>
        </div>
      </div>
    </div>
    <div>
      <button @click="logout">Logout</button>
    </div>
  </InfoPage>
</template>

<style scoped>
div.user-info {
  display: grid;
  grid-template-columns: 10rem max-content;
  grid-auto-rows: max-content;
  grid-column-gap: 1rem;
  grid-row-gap: .5rem;
  margin: 3rem auto;
}

div.item-box {
  display: grid;
  grid-column: 1 / -1;
  grid-template-columns: subgrid;
}

div.item-label {
  text-align: right;
  grid-column: 1 / 2;
}

div.item-value {
  grid-column: 2 / 3;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}

div.item-value.not-verified {
  flex-direction: column;
}

div.item-value.not-verified .resend-button * {
  font-weight: normal;
}

div.item-value.not-verified .sent-message {
  font-style: italic;
  display: flex;
  flex-direction: row;
  align-items: center;
}

div.item-value.not-verified .sent-message .spinner {
  width: 1.2rem;
  height: 1.2rem;
  margin-left: 1rem;
}

div.item-value *:first-child {
  font-weight: bold;
}

div.item-value * {
  margin-right: 0.5rem;
}
</style>