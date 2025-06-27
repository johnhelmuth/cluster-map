<script setup lang="ts">

import {useModalStateStore} from "~/stores/use-modal-state-store";

const {loggedIn, user, clear} = useUserSession();
const {setCurrentOpenModal, closeModal} = useModalStateStore('userMenu', toggleUserMenu);

const initials = computed(() => {
  if (loggedIn.value && user.value) {
    const username = user.value?.authenticationData[0]?.username;
    if (username) {
      return username[0].toUpperCase();
    }
  }
});

const isActive = ref(false);

function toggleUserMenu() {
  isActive.value = !isActive.value;
  if (isActive.value) {
    setCurrentOpenModal();
  } else {
    closeModal();
  }
}

</script>

<template>
  <AuthState v-slot="{loggedIn}">
    <div>
      <div v-if="loggedIn" class="user-menu-widget" :class="{ 'active': isActive}" @click="toggleUserMenu">
        <div class="profile-button">
          {{ initials }}
        </div>
        <Teleport to="body">
          <Transition name="slide">
            <nav v-show="isActive" class="user-menu-list" :class="{ 'active': isActive }">
              <div class="face-front">
                <slot></slot>
              </div>
              <div class="face-back">{{ initials }}</div>
            </nav>
          </Transition>
        </Teleport>
      </div>
      <NuxtLink v-else class="login-button" to="/login" title="Login">
        <Icon class="button-icon" name="material-symbols:login-rounded"/>
      </NuxtLink>
    </div>
  </AuthState>
</template>

<style scoped>

.user-menu-widget {
  display: flex;
  flex-direction: column;
}

.profile-button {
  display: block;
  background-color: var(--color-background-mute);
  font-weight: bolder;
  border-radius: 50%;
  width: 2rem;
  height: 2rem;
  line-height: 1.9;
  text-align: center;
  cursor: pointer;
}

.login-button {
  background-color: var(--color-background-mute);
  border-radius: 50%;
  width: 2rem;
  height: 2rem;
  cursor: pointer;
  padding: 0;
  margin: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.login-button .button-icon {
  width: 1.5rem;
  height: 1.5rem;
  padding: 0;
  margin: 0;
  position: relative;
  left: -0.125rem; /* Adjust because the icon visually is unbalanced. */
}

.user-menu-list {
  background-color: var(--color-background);
  text-align: left;
  position: absolute;
  top: 3rem;
  right: 3rem;
  z-index: var(--layers-navigation);
  padding: 0;
  box-shadow: inset -0.1rem -0.1rem 0.1rem grey,
  inset 0.1rem 0.1rem 0.1rem lightgrey;
  transform-style: preserve-3d;
}

.user-menu-list > div {
  display: flex;
  flex-direction: column;
  padding: 0.5rem 0;
}

.user-menu-list .face-back {
  position: absolute;
  background-color: var(--color-background-soft);
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  transform: translateZ(-1px) rotateY(180deg);
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

.user-menu-list.slide-enter-active, .user-menu-list.slide-leave-active {
  transition: all .5s linear;
}
.user-menu-list.slide-enter-from,
.user-menu-list.slide-leave-to {
  transform-origin: right top;
}

.user-menu-list.slide-enter-from, .user-menu-list.slide-leave-to {
  transform: rotate3d(1, 0, 0, 135deg);
}

</style>