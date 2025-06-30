<template>
  <form @submit.prevent="submitInteraction" class="add-interaction flex flex-col justify-between mb-6 gap-3">
    <div class="flex w-full flex-col">
      <label class="block text-gray-700 dark:text-gray-300 mb-1"
        >Interaktion hinzufügen</label>
      <input 
        type="date" 
        v-model="date" 
        required 
        class="date-input border border-gray-300 text-lg block rounded-lg text-gray-700 dark:text-gray-300 dark:bg-gray-700 mb-2 p-2"
        />
      <div class="flex gap-2">
        <textarea 
          v-model="text" 
          placeholder="Interaktion..." 
          required
          class="border border-gray-300 text-input text-gray-700 dark:text-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-700 dark:caret-gray-300 px-3 py-2 w-full"
          >
        </textarea>
        <div class="mt-auto">
          <button
            type="submit"
            class="submit-button px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 text-base px-4 py-2 ml-auto"
            >
            <FontAwesomeIcon icon="fa-floppy-disk" class="text-lg"/>
          </button>
        </div>
      </div>
    </div>
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