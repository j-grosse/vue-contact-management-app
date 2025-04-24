<template>
  <div
    class="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
    @click="$emit('close')"
  >
    <div
      class="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md mx-auto overflow-hidden"
      @click.stop
    >
      <div class="p-6">
        <h2 class="text-2xl font-bold text-gray-800 dark:text-white mb-4">
          Einstellungen
        </h2>
        <div class="flex flex-col items-center gap-2">
          <div class="flex flex-col items-center gap-2 dark:text-white">
            Theme
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
                :icon="appStore.isDarkMode ? 'fa-sun' : 'fa-moon'"
              ></FontAwesomeIcon>
            </button>
          </div>
        </div>
        <div class="flex justify-center my-10 gap-4">
          <div class="flex flex-col items-center gap-2 dark:text-white">
            Backup erstellen
            <button
              @click="exportData"
              class="bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 border border-gray-300 dark:border-gray-600 p-2 rounded-full flex items-center justify-center w-10 h-10 text-gray-800 dark:text-gray-200"
              title="'Daten exportieren'"
            >
              <FontAwesomeIcon icon="fa-floppy-disk"></FontAwesomeIcon>
            </button>
          </div>

          <div class="flex flex-col items-center gap-2 dark:text-white">
            Backup importieren
            <!-- Hidden file input -->
            <input
              type="file"
              @change="importData"
              ref="fileInput"
              class="hidden"
            />
            <button
              @click="fileInput?.click()"
              class="bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 border border-gray-300 dark:border-gray-600 p-2 rounded-full flex items-center justify-center w-10 h-10 text-gray-800 dark:text-gray-200"
              title="'Daten importieren'"
            >
              <FontAwesomeIcon icon="fa-file-import"></FontAwesomeIcon>
            </button>
          </div>
        </div>

        <div class="flex justify-end mt-6">
          <div class="flex gap-3">
            <button
              type="button"
              @click="$emit('close')"
              class="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 text-base"
            >
              Schließen
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useAppStore } from '~/stores/app';
import { useFileUtils } from '~/composables/useFileUtils';

const appStore = useAppStore();
const fileInput = ref(null);
const { exportFromLocalStorage, importToLocalStorage } = useFileUtils();

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

defineEmits(['close']);
</script>
