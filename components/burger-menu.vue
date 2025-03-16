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
          <slot></slot>
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
  display: flex;
  flex-direction: column;
  position: absolute;
  top: calc(var(--burger-menu-button-height) + 1.5rem);
  right: 1rem;
  z-index: var(--layers-navigation);

  box-shadow: inset -0.1rem -0.1rem 0.1rem grey,
              inset 0.1rem 0.1rem 0.1rem lightgrey;

}

.burger-menu-list.slide-enter-active, .burger-menu-list.slide-leave-active {
  transition: all 0.3s ease-out;
}

.burger-menu-list.slide-enter-from,
.burger-menu-list.slide-leave-to {
  perspective: 800px;
  transform: rotate3d(0, 1, 0, 90deg);
  transform-origin: right 100%;
}
.burger-menu-list.slide-leave-to {
  transform: rotate3d(0, 1, 0, -90deg);
}

</style>