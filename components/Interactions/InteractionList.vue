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
          <button
          @click="$emit('delete', interaction.id)"
          class="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 text-base px-4 py-2 ml-auto"
        >
          <FontAwesomeIcon icon="fa-xmark" />
        </button>
      </div>
      <div class="text-md p-1 rounded-lg">{{ interaction.text }}</div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

const props = defineProps({
  interactions: {
    type: Array,
    required: true
  }
});

const emit = defineEmits(['delete']);

const formatDate = (date) => {
  const d = new Date(date);
  const day = d.getDate().toString().padStart(2, '0');
  const month = (d.getMonth() + 1).toString().padStart(2, '0');
  const year = d.getFullYear();
  return `${day}.${month}.${year}`;
};

const getDaysAgo = (date) => {
  const today = new Date();
  const interactionDate = new Date(date);
  
  // Reset time part to compare only dates
  today.setHours(0, 0, 0, 0);
  interactionDate.setHours(0, 0, 0, 0);
  
  const diffTime = today - interactionDate;
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays === 0) return 'Heute';
  if (diffDays === 1) return 'Gestern';
  if (diffDays < 21) return `Vor ${diffDays} Tagen`;
  if (diffDays < 30) return `Vor ${Math.floor(diffDays / 7)} Wochen`;
  if (diffDays < 365) return `Vor ${Math.floor(diffDays / 30)} Monaten`;
  return `Vor ${Math.floor(diffDays / 365)} Jahren`;
};
</script>
