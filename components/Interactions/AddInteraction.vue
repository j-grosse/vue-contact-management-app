<template>
  <form @submit.prevent="submitInteraction" class="add-interaction flex flex-col justify-between mb-6 gap-3">
    <div class="flex w-full flex-col">
        <input 
          type="date" 
          v-model="date" 
          required 
          class="date-input text-lg block text-gray-700 dark:text-gray-300 mb-1 mr-auto"
          />
        <textarea 
          v-model="text" 
          placeholder="Text..." 
          required
          class="text-input border rounded-lg p-3"
          >
      </textarea>
    </div>
    <button
      type="submit"
      class="submit-button px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 text-base px-4 py-2 ml-auto"
      >
      <FontAwesomeIcon icon="fa-floppy-disk" />
    </button>
  </form>
</template>

<script setup>
const emit = defineEmits(['add']);
const date = ref(new Date().toISOString().split('T')[0]);
const text = ref('');

const submitInteraction = () => {
  emit('add', {
    date: date.value,
    text: text.value
  });
  text.value = '';
};
</script>