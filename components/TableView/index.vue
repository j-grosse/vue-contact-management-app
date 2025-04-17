<template>
  <div
    class="mb-2 bg-yellow-50 dark:bg-yellow-900/20 p-3 rounded-lg border border-yellow-200 dark:border-yellow-800"
  >
    <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
      <!-- Upcoming Contacts -->
      <UpcomingList
        :friends="upcomingContacts"
        @edit="(friend) => $emit('edit', friend)"
        @contact="(friend) => $emit('contact', friend)"
      />

      <!-- Recently Contacted -->
      <RecentList
        :friends="recentContacts"
        @edit="(friend) => $emit('edit', friend)"
      />
    </div>
  </div>
</template>

<script setup>
import RecentList from './RecentList.vue';
import UpcomingList from './UpcomingList.vue';
defineProps({
  upcomingContacts: {
    type: Array,
    required: true,
  },
  recentContacts: {
    type: Array,
    required: true,
  },
});

defineEmits(['edit', 'contact']);
</script>
