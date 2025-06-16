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
              ({{ getDaysAgo(interaction.date) }})
          </span>
          
      </div>
      <div class="flex">
        <div class="text-md text-gray-700 dark:text-gray-300 p-1 rounded-lg">{{ interaction.text }}</div>
        <button
            @click="$emit('delete', interaction.id)"
            class="px-4 py-2 rounded-lg text-gray-700 dark:text-gray-300 hover:text-gray-400 dark:hover:text-gray-100 px-4 py-2 ml-auto"
          >
            <FontAwesomeIcon icon="fa-times" />
          </button>
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

const emit = defineEmits(['delete']);

</script>
