<template>
  <div class="dark:bg-yellow-900/20 rounded-lg shadow-md overflow-hidden my-1 mb-4"
  >
    <!-- global interactions window content-->
    <div class="p-2">
      <div
        class="mb-0 overflow-y-auto overflow-x-hidden bg-gray-50 dark:bg-gray-900 rounded-lg p-2"
      >
        <div class="space-y-2 max-h-[22rem]">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-2">
            <div
              v-for="interaction in visibleInteractions"
              :key="interaction.id"
              class="bg-white dark:bg-gray-800 rounded-lg px-3 py-2 cursor-pointer transition-transform shadow hover:shadow-lg"
              @click="$emit('edit', interaction.friend)"
            >
              <div class="flex justify-between gap-3">
                <div class="flex items-start gap-3">
                  <div class="flex flex-col text-center gap-2">
                    <img
                      :src="interaction.friend.photo || 'https://i.imgur.com/tdi3NGa.png'"
                      alt="Friend"
                      class="min-w-12 min-h-12 w-12 h-12 rounded-full object-cover"
                    />
                  </div>
                  <div class="flex">
                    <div class="flex flex-col justify-between items-start">
                      <div class="font-medium text-gray-800 dark:text-gray-200">
                        {{ interaction.friend.name }} 
                      </div>
                      <div class="text-sm text-gray-500 dark:text-gray-400">
                            {{ getDaysAgo(interaction.date) }}
                      </div>
                    </div>
                  </div>
                </div>
                <img
                  v-if="interaction.photo"
                  :src="interaction.photo"
                  class="h-12 rounded-lg object-cover overflow-hidden"
                  alt="Interaction photo"
                />
              </div>
              <div class="pt-2 text-gray-700 dark:text-gray-300 border-l pl-2 text-sm line-clamp-3">
                {{ interaction.text }}
              </div>
            </div>
          </div>
          <div v-if="allInteractions.length === 0" class="text-center text-gray-400 dark:text-gray-500 py-8">
            Noch keine Interaktionen vorhanden.
          </div>
        </div>
      </div>
    </div>
  </div>

  </template>
  
  <script setup>
  import { computed } from 'vue';
  import { useFriendsStore } from '~/stores/friends';
  import { getDaysAgo } from '~/utils/dateHelper';

  defineEmits(['edit']);

  const friendsStore = useFriendsStore();
  
  // Use computed property - it will automatically update when the store changes
  const allInteractions = computed(() => {
    return friendsStore.friends
      .flatMap(friend =>
        (friend.interactions || []).map((interaction, idx) => ({
          ...interaction,
          friend,
          _friendIndex: idx // preserve original order within friend
        }))
      )
      .sort((a, b) => {
        const dateA = new Date(a.date);
        const dateB = new Date(b.date);
        if (dateA.getTime() !== dateB.getTime()) {
          return dateB - dateA; // most recent first
        }
        // If dates are the same, show in reverse order of original (higher index first)
        if (a.friend === b.friend) {
          return b._friendIndex - a._friendIndex;
        }
        // If from different friends but same date, keep original order (or sort by friend name/id if needed)
        return 0;
      });
  });
  
  // Only show the last 30 interactions initially
  const visibleInteractions = computed(() => {
    return allInteractions.value.slice(0, 30);
  });
  </script>