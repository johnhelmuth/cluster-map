<script setup lang="ts">

import {useModalStateStore} from "~/stores/use-modal-state-store";

const { setCurrentOpenModal, closeModal } = useModalStateStore('burgerMenu', toggleActive);

const isActive = ref(false);

function toggleActive() {
  isActive.value = !isActive.value;
  if (isActive.value) {
    setCurrentOpenModal();
  } else {
    closeModal();
  }
}

</script>

<template>
  <div id="burger" :class="{ 'active': isActive}" @click="toggleActive">
    <button type="button" class="burger-button" title="Menu">
      <span class="burger-bar burger-bar--1"></span>
      <span class="burger-bar burger-bar--2"></span>
      <span class="burger-bar burger-bar--3"></span>
    </button>
    <Teleport to="body">
      <Transition name="slide">
        <nav v-show="isActive" class="burger-menu-list" :class="{ 'active': isActive}" @click="toggleActive">
          <div class="face-front">
            <slot></slot>
          </div>
          <div class="face-back"><img src="/images/banes-eye-space-navy-admiral.png"></div>
        </nav>
      </Transition>
    </Teleport>
  </div>
</template>

<style scoped>

@property --burger-menu-button-height {
  syntax: "<length>";
  inherits: true;
  initial-value: 30px;
}
@property --burger-menu-button-width {
  syntax: "<length>";
  inherits: true;
  initial-value: 40px;
}

@property --burger-menu-list-width {
  syntax: "<length>";
  inherits: true;
  initial-value: 200px;
}

#burger {
  display: flex;
  flex-direction: column;
  --burger-menu-button-height: 1.5rem;
  --burger-menu-button-width: 2rem;
}

#burger.active .burger-button {
  transform: rotate(180deg);
}

#burger.active .burger-button .burger-bar {
  background-color: var(--color-text);
}

#burger.active .burger-button .burger-bar--1 {
  transform: rotate(45deg);
  top: 50%;
}

#burger.active .burger-button .burger-bar--2 {
  opacity: 0;
}

#burger.active .burger-button .burger-bar--3 {
  transform: rotate(-45deg);
  top: 50%;
}

.burger-button {
  position: relative;
  height: var(--burger-menu-button-height);
  width: var(--burger-menu-button-width);
  display: block;
  z-index: var(--layers-controls-ink);
  border: 0;
  border-radius: 0;
  background-color: transparent;
  pointer-events: all;
  transition: transform .6s cubic-bezier(.165, .84, .44, 1);
}

.burger-button .burger-bar {
  background-color: var(--color-text);
  position: absolute;
  top: 50%;
  right: 6px;
  left: 6px;
  height: 3px;
  width: auto;
  margin-top: -1px;
  transition: transform .6s cubic-bezier(.165, .84, .44, 1), opacity .3s cubic-bezier(.165, .84, .44, 1), background-color .6s cubic-bezier(.165, .84, .44, 1);
}

.burger-button .burger-bar--1 {
  transform: translateY(-6px);
  top: 40%;
}

.burger-button .burger-bar--2 {
  transform-origin: 100% 50%;
  transform: scaleX(1);
}

.burger-button:hover .burger-bar--2 {
  transform: scaleX(1);
}

.no-touchevents .burger-bar--2:hover {
  transform: scaleX(1);
}

.burger-button .burger-bar--3 {
  transform: translateY(6px);
  top: 60%;
}

button {
  cursor: pointer;
}

/* remove blue outline */
button:focus {
  outline: 0;
}

.burger-menu-list {
  background-color: var(--color-background);
  width: var(--burger-menu-list-width);
  text-align: left;
  position: absolute;
  top: calc(var(--burger-menu-button-height) + 2.5rem);
  right: 1rem;
  z-index: var(--layers-navigation);
  padding: 0;
  box-shadow: inset -0.1rem -0.1rem 0.1rem grey,
              inset 0.1rem 0.1rem 0.1rem lightgrey;
  transform-style: preserve-3d;
}

.burger-menu-list > div {
  display: flex;
  flex-direction: column;
  padding: 0.5rem 0;
}
.burger-menu-list .face-back {
  position: absolute;
  background-color: var(--color-background-soft);
  top: 0; left: 0; bottom: 0; right: 0;
  transform: translateZ(-1px) rotateY(180deg);
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}
.burger-menu-list .face-back :deep(img) {
  height: calc(var(--burger-menu-list-width) - 2rem);
  width: calc(var(--burger-menu-list-width) - 2rem);
  opacity: 0.2;
}

.burger-menu-list.slide-enter-active, .burger-menu-list.slide-leave-active {
  transition: all .5s linear;
}
.burger-menu-list.slide-enter-from,
.burger-menu-list.slide-leave-to {
  transform-origin: right top;
}

.burger-menu-list.slide-enter-from, .burger-menu-list.slide-leave-to {
  transform: rotate3d(1, 0, 0, 135deg);
}
</style>