<template>
  <div class="relative max-w-lg">
    <input
      type="text"
      :value="modelValue"
      @input="$emit('update:modelValue', $event.target.value)"
      placeholder="Suchen..."
      class="pl-10 pr-4 py-2 border rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-800 dark:text-white dark:border-gray-700 text-base"
    />
    <FontAwesomeIcon
      icon="fa-search"
      class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
    ></FontAwesomeIcon>
  </div>
</template>

<script setup>
defineProps({
  modelValue: {
    type: String,
    default: '',
  },
});

defineEmits(['update:modelValue']);
</script>
