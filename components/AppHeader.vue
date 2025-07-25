<template>
  <header class="mb-4 flex justify-between items-center">
    <div class="flex gap-4">
      <img alt="Logo" src="../public/logo.png" class="w-8 h-8" />
      <!-- <h1 class="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-white">
        FriendCare
      </h1> -->
    </div>
    <div class="flex items-center gap-3"> 
      <!-- <button
        @click="appStore.toggleViewMode"
        class="bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 border border-gray-300 dark:border-gray-600 p-2 rounded-full flex items-center justify-center w-10 h-10 text-gray-800 dark:text-gray-200"
        :title="
          appStore.viewMode === 'table'
            ? 'Zur Gitteransicht'
            : 'Zur Tabellenansicht'
        "
      >
        <FontAwesomeIcon
          :icon="appStore.viewMode === 'table' ? 'fa-list' : 'fa-th'"
        ></FontAwesomeIcon>
      </button> -->

      <button
        @click="appStore.isPreferencesModalOpen = true"
        class="bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 border border-gray-300 dark:border-gray-600 p-2 rounded-full flex items-center justify-center w-10 h-10 text-gray-800 dark:text-gray-200"
        title="'Einstellungen'"
      >
        <FontAwesomeIcon icon="fa-cog"></FontAwesomeIcon>
      </button>
    </div>
  </header>
</template>

<script setup>
import { useAppStore } from '~/stores/app';

const appStore = useAppStore();
</script>
