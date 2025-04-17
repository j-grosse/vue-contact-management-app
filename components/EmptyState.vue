<template>
  <div class="flex flex-col items-center justify-center py-12">
    <div class="bg-gray-200 dark:bg-gray-700 p-8 rounded-full mb-4">
      <i class="fas fa-users text-4xl text-gray-500 dark:text-gray-400"></i>
    </div>
    <h3 class="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
      Keine Freunde gefunden
    </h3>
    <p class="text-gray-500 dark:text-gray-400 text-center mb-6">
      {{
        searchQuery
          ? 'Es wurden keine Freunde gefunden, die deiner Suche entsprechen.'
          : 'Füge deinen ersten Freund hinzu, um zu beginnen.'
      }}
    </p>
    <button
      @click="$emit('add')"
      class="bg-primary hover:bg-primary/80 text-white p-2 rounded-full flex items-center justify-center w-12 h-12"
    >
      <i class="fas fa-plus text-lg"></i>
    </button>
  </div>
</template>

<script setup>
defineProps({
  searchQuery: {
    type: String,
    default: '',
  },
});

defineEmits(['add']);
</script>
