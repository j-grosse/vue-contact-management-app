import { defineStore } from 'pinia';

export const useAppStore = defineStore('app', {
  state: () => ({
    viewMode: 'cards', // 'cards' or 'table'
    isDarkMode: false,
    isPreferencesModalOpen: false,
  }),

  actions: {
    toggleViewMode() {
      this.viewMode = this.viewMode === 'table' ? 'cards' : 'table';
    },

    toggleDarkMode() {
      this.isDarkMode = !this.isDarkMode;

      if (process.client) {
        if (this.isDarkMode) {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
      }
    },

    setDarkMode(value) {
      this.isDarkMode = value;

      if (process.client) {
        if (this.isDarkMode) {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
      }
    },
  },
});
