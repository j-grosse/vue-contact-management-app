<template>
  <div class="min-h-[24rem] dark:bg-yellow-900/20 rounded-lg shadow-md overflow-hidden my-2 mb-4"
  >
    <!-- Chatbot window content -->
    <div class="p-4">
      <div
        class="mb-4 h-80 overflow-y-auto overflow-x-hidden bg-gray-50 dark:bg-gray-900 rounded-lg p-3"
      >
        <!-- global interactions window content-->
        <div class="space-y-3 max-h-[400px] pr-2">
          <div
            v-for="interaction in visibleInteractions"
            :key="interaction.id"
            class="bg-white dark:bg-gray-800 rounded-lg p-3 cursor-pointer transition-transform"
            @click="$emit('edit', interaction.friend)"
          >
            <div class="flex items-start gap-3">
              <div class="flex flex-col text-center gap-2">
                <img
                  :src="interaction.friend.photo || 'https://i.imgur.com/tdi3NGa.png'"
                  alt="Freund"
                  class="w-12 h-12 rounded-lg object-cover"
                />
              </div>
              <div class="flex-1">
                <div class="flex justify-between items-start">
                  <div class="font-medium text-gray-800 dark:text-gray-200">
                    {{ interaction.friend.name }} 
                  </div>
                  <span class="text-sm text-gray-500 dark:text-gray-400">
                        {{ getDaysAgo(interaction.date) }}
                  </span>
                </div>
                <div class="mt-1 text-gray-700 dark:text-gray-300 text-sm">
                  {{ interaction.text }}
                </div>
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
        (friend.interactions || []).map(interaction => ({
          ...interaction,
          friend
        }))
      )
      .sort((a, b) => new Date(b.date) - new Date(a.date));
  });
  
  // Only show the last 30 interactions initially
  const visibleInteractions = computed(() => {
    return allInteractions.value.slice(0, 30);
  });
  </script>