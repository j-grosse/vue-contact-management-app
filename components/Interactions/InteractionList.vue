<template>
  <div class="interactions-list">
    <!-- sort entries by date and reverse order -->
    <div
      v-for="interaction in [...interactions].sort((a, b) => new Date(a.date) - new Date(b.date)).reverse()"
      :key="interaction.id"
      class="interaction-item mb-4 border-l pl-2"
    >
      <div class="date text-lg block text-gray-700 dark:text-gray-300">
          {{ formatDate(interaction.date) }}
          <span class="text-lg text-gray-700 dark:text-gray-300 pl-1">
              {{ getDaysAgo(interaction.date) }}
          </span>
          
      </div>
      <div class="flex">
        <div class="text-md text-gray-700 dark:text-gray-300 p-1 rounded-lg">{{ interaction.text }}</div>
        
        <div class="flex gap-2 ml-auto">
          <button
            @click="editInteraction(interaction)"
            class="px-2 py-2 rounded-lg text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            title="Edit interaction"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </button>
          <button
          @click="$emit('delete', interaction.id)"
          class="px-2 py-2 rounded-lg text-gray-700 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400 transition-colors"
            title="Delete interaction"
          >
            <FontAwesomeIcon icon="fa-times" />
          </button>
        </div>
      </div>
    </div>

    <!-- Edit Interaction Modal -->
    <div v-if="showEditModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md mx-4">
        <div class="flex justify-between items-center mb-4">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100">
            Interaktion bearbeiten
          </h3>
          <button
            @click="closeEditModal"
            class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
          </button>
        </div>
        
        <form @submit.prevent="saveEditedInteraction">
          <div class="mb-4">
            <!-- <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Date
            </label> -->
            <input
              v-model="editForm.date"
              type="date"
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-100"
              required
            />
          </div>
          
          <div class="mb-6">
            <!-- <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Interaction
            </label> -->
            <textarea
              v-model="editForm.text"
              rows="4"
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-100"
              placeholder="Enter interaction details..."
              required
            ></textarea>
          </div>
          
          <div class="bg-white dark:bg-gray-800">
            <div class="flex justify-between">
              <div></div>
              <div class="flex justify-between gap-3">
                <button
                type="button"
                @click="closeEditModal"
                class="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 text-base"
                >
                  <FontAwesomeIcon icon="fa-times" />
                </button>
                <button
                  type="submit"
                  class="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 text-base"
                >
                  <FontAwesomeIcon icon="fa-check" />
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { getDaysAgo } from '~/utils/dateHelper';
import { formatDate } from '~/utils/dateHelper';

const props = defineProps({
  interactions: {
    type: Array,
    required: true
  }
});

const emit = defineEmits(['delete', 'edit']);

// Edit modal state
const showEditModal = ref(false);
const editForm = ref({
  id: null,
  date: '',
  text: ''
});

// Function to handle edit interaction
const editInteraction = (interaction) => {
  editForm.value = {
    id: interaction.id,
    date: interaction.date,
    text: interaction.text
  };
  showEditModal.value = true;
};

// Function to close edit modal
const closeEditModal = () => {
  showEditModal.value = false;
  editForm.value = {
    id: null,
    date: '',
    text: ''
  };
};

// Function to save edited interaction
const saveEditedInteraction = () => {
  emit('edit', {
    id: editForm.value.id,
    date: editForm.value.date,
    text: editForm.value.text
  });
  closeEditModal();
};
</script>
