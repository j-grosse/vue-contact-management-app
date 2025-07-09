<template>
  <div class="interactions-list">
    <!-- sort entries by date and reverse order -->
    <label class="block text-gray-700 dark:text-gray-300 mb-1"
    >Interaktionen</label>
    <div class="bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg p-2 pt-3 overflow-y-auto h-48">
      <div
        v-for="interaction in [...interactions].sort((a, b) => new Date(a.date) - new Date(b.date)).reverse()"
        :key="interaction.id"
        class="interaction-item bg-white dark:bg-gray-800 rounded-lg mb-2 p-2 cursor-pointer shadow hover:shadow-md"
        @click="editInteraction(interaction)"
      >
        <div class="flex items-start">
          <div class="flex-1">
            <div class="date block text-gray-700 dark:text-gray-300 pb-2">
              {{ getDaysAgo(interaction.date) }}&nbsp;
              ({{ getGermanWeekday(interaction.date) }} {{ formatDate(interaction.date).slice(0, -4) }})
            </div>
            <div class="border-l pl-2 text-gray-700 dark:text-gray-300 p-1">{{ interaction.text }}</div>
          </div>
          <div class="flex flex-col items-end ml-3">
            <img
              v-if="interaction.photo"
              :src="interaction.photo"
              class="h-12 rounded-lg object-cover"
              alt="Interaction"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- Edit Interaction Modal -->
    <div v-if="showEditModal" class="fixed inset-0 bg-black bg-opacity-20 flex items-center justify-center z-50" @click.self="closeEditModal()">
      <div class="bg-white dark:bg-gray-800 rounded-lg p-4 w-full max-w-md mx-4">
        <h2 class="text-2xl font-bold text-gray-800 dark:text-white mb-4">
          Interaktion bearbeiten
        </h2>
        
        <form @submit.prevent="saveEditedInteraction">
          <div class="mb-4">
            <!-- <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Datum
            </label> -->
            <input
              v-model="editForm.date"
              type="date"
              class="border border-gray-300 block rounded-lg text-gray-700 dark:text-gray-300 dark:bg-gray-700 mb-2 p-2"
              required
            />
          </div>
          
          <div class="mb-3">
            <!-- <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Interaktion
            </label> -->
            <textarea
              v-model="editForm.text"
              rows="4"
              class="border border-gray-300 text-input text-gray-700 dark:text-gray-300 rounded-lg dark:bg-gray-700 dark:caret-gray-300 px-3 py-2 w-full"
              placeholder="Enter interaction details..."
              required
            ></textarea>
          </div>
          <ImageUpload v-model="editForm.photo"/>

          <div class="bg-white dark:bg-gray-800 mt-3">
            <div class="flex justify-between">
              <button
                type="button"
                @click="$emit('delete', editForm.id); closeEditModal()"
                class="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-base flex items-center"
                title="Delete interaction"
              >
                <FontAwesomeIcon icon="fa-trash" />
              </button>
              <div class="flex justify-between gap-3">
                <button
                type="button"
                @click="closeEditModal"
                class="btn-variant text-base"
                >
                  <FontAwesomeIcon icon="fa-times" />
                </button>
                <button
                  type="submit"
                  class="btn-variant text-base"
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
import { getGermanWeekday } from '~/utils/dateHelper';
import ImageUpload from '~/components/ImageUpload.vue';

const props = defineProps({
  interactions: {
    type: Array,
    required: true
  }
});

const emit = defineEmits(['close', 'delete', 'edit']);

// Edit modal state
const showEditModal = ref(false);
const editForm = ref({
  id: null,
  date: '',
  text: '',
  photo: null
});

// Function to handle edit interaction
const editInteraction = (interaction) => {
  editForm.value = {
    id: interaction.id,
    date: interaction.date,
    text: interaction.text,
    photo: interaction.photo
  };
  showEditModal.value = true;
};

// Function to close edit modal
const closeEditModal = () => {
  showEditModal.value = false;
  editForm.value = {
    id: null,
    date: '',
    text: '',
    photo: null
  };
};

// Function to save edited interaction
const saveEditedInteraction = () => {
  emit('edit', {
    id: editForm.value.id,
    date: editForm.value.date,
    text: editForm.value.text,
    photo: editForm.value.photo
  });
  closeEditModal();
};
</script>
