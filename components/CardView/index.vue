<template>
  <div
    class="mb-2 bg-yellow-50 dark:bg-yellow-900/20 p-3 rounded-lg border border-yellow-200 dark:border-yellow-800"
  >
    <!-- Recent Contacts Photo Row -->
    <RecentList
      v-if="recentContacts.length > 0"
      :friends="recentContacts"
      @edit="(friend) => $emit('edit', friend)"
    />

    <!-- Friends grid -->
    <h2
      class="text-xl font-semibold text-yellow-800 dark:text-yellow-500 mb-3 mt-4"
    >
      Anstehend
    </h2>
    <div
      v-if="filteredFriends.length > 0"
      class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3"
    >
      <FriendCard
        v-for="friend in filteredFriends"
        :key="friend.id"
        :friend="friend"
        @edit="$emit('edit', friend)"
        @contact="$emit('contact', friend)"
      />
    </div>
  </div>
</template>

<script setup>
import FriendCard from './FriendCard.vue';
import RecentList from './RecentList.vue';
defineProps({
  filteredFriends: {
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
