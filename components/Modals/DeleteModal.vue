<template>
  <div
    class="app-min-width fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50"
    @click="$emit('close')"
  >
    <div
      class="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md mx-auto p-6"
    >
      <h3 class="text-xl font-bold text-gray-800 dark:text-white mb-4">
        Friend löschen?
      </h3>
      <p class="text-gray-600 dark:text-gray-300 mb-6">
        Bist du sicher, dass du
        <span class="font-semibold">{{ friend?.name }}</span> löschen möchtest?
        Diese Aktion kann nicht rückgängig gemacht werden.
      </p>
      <div class="flex justify-end gap-3">
        <button
          @click="$emit('close')"
          class="btn-variant"
        >
          <FontAwesomeIcon icon="fa-times" />
        </button>
        <button
          @click="$emit('confirm')"
          class="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg"
        >
          <FontAwesomeIcon icon="fa-trash" />
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  friend: {
    type: Object,
    required: true,
  },
});

defineEmits(['close', 'confirm']);
</script>
