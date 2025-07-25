<template>
  <div
    class="app-min-width fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
    @click="$emit('close')"
  >
    <div
      class="modal-style"
      @click.stop
    >
      <div class="p-4">
        <h2 class="text-2xl font-bold text-gray-800 dark:text-white mb-4">
          Einstellungen
        </h2>
        <div class="flex flex-col items-left gap-2">
          <div class="flex items-center gap-2 dark:text-white">
            <button
              @click="appStore.toggleDarkMode()"
              class="bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 border border-gray-300 dark:border-gray-600 p-2 rounded-full flex items-center justify-center w-10 h-10 text-gray-800 dark:text-gray-200"
              :title="
                appStore.isDarkMode
                  ? 'Zum hellen Modus wechseln'
                  : 'Zum dunklen Modus wechseln'
              "
            >
              <FontAwesomeIcon
                :icon="appStore.isDarkMode ? 'fa-moon' : 'fa-sun'"
              ></FontAwesomeIcon>
            </button>
            <p @click="appStore.toggleDarkMode()" class="cursor-pointer">
              Theme
            </p>
          </div>
          <div class="flex items-center gap-2 dark:text-white">
            <button
              @click="exportData"
              class="bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 border border-gray-300 dark:border-gray-600 p-2 rounded-full flex items-center justify-center w-10 h-10 text-gray-800 dark:text-gray-200"
              title="'Daten exportieren'"
            >
              <FontAwesomeIcon icon="fa-floppy-disk"></FontAwesomeIcon>
            </button>
            <p @click="exportData" class="cursor-pointer">Backup erstellen</p>
          </div>
          <div class="flex items-center gap-2 dark:text-white">
            <!-- Hidden file input -->
            <input
              type="file"
              @change="importData"
              ref="fileInput"
              class="hidden"
              accept=".json"
            />
            <button
              @click="fileInput?.click()"
              class="bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 border border-gray-300 dark:border-gray-600 p-2 rounded-full flex items-center justify-center w-10 h-10 text-gray-800 dark:text-gray-200"
              title="'Daten importieren'"
            >
              <FontAwesomeIcon icon="fa-file-import"></FontAwesomeIcon>
            </button>
            <p @click="fileInput?.click()" class="cursor-pointer">
              Backup importieren
            </p>
          </div>
          <div class="flex items-center gap-2 dark:text-white">
            <button
              @click="openSplashScreen"
              class="bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 border border-gray-300 dark:border-gray-600 p-2 rounded-full flex items-center justify-center w-10 h-10 text-gray-800 dark:text-gray-200"
              title="'Über diese App'"
            >
              <FontAwesomeIcon icon="fa-info"></FontAwesomeIcon>
            </button>
            <p @click="openSplashScreen" class="cursor-pointer">
              Über diese App
            </p>
          </div>
        </div>

        <div class="flex justify-end mt-6">
          <div class="flex gap-3">
            <button
              type="button"
              @click="$emit('close')"
              class="btn-variant text-base"
            >
              <FontAwesomeIcon icon="fa-check" />
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>

  <SplashScreen v-if="showSplashScreen" @click="$emit('close')" />
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';
import { useAppStore } from '~/stores/app';
import { useFileUtils } from '~/composables/useFileUtils';
import SplashScreen from './SplashScreen.vue';

const appStore = useAppStore();
const fileInput = ref(null);
const { exportFromLocalStorage, importToLocalStorage } = useFileUtils();

const showSplashScreen = ref(false);

const exportData = () => {
  if (process.client) {
    exportFromLocalStorage();
  }
};

const importData = (event) => {
  if (process.client) {
    importToLocalStorage(event);
  }
};

const openSplashScreen = () => {
  showSplashScreen.value = true;
};

defineEmits(['close']);

onMounted(() => {
  document.body.classList.add('modal-open');
});

onBeforeUnmount(() => {
  document.body.classList.remove('modal-open');
});
</script>
