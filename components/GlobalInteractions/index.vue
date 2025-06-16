<template>
    <div class="global-interactions">
      <div class="space-y-3 max-h-[400px] overflow-y-auto pr-2">
        <div
          v-for="interaction in visibleInteractions"
          :key="interaction.id"
          class="bg-white dark:bg-gray-800 rounded-lg p-3 shadow-md hover:shadow-lg cursor-pointer transition-transform"
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
                  <br />
                  <div class="text-sm text-gray-500 dark:text-gray-400">
                      {{ getDaysAgo(interaction.date) }}
                  </div>
                </div>
                <div class="text-sm text-gray-500 dark:text-gray-400">
                    {{ formatDate(interaction.date) }}
                </div>
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
  </template>
  
  <script setup>
  import { computed } from 'vue';
  import { useFriendsStore } from '~/stores/friends';
  import { getDaysAgo } from '~/utils/dateHelper';
  import { formatDate } from '~/utils/dateHelper';

  const friendsStore = useFriendsStore();
  
  const allInteractions = computed(() => {
    // Flatten all interactions and attach friend info
    return friendsStore.friends
      .flatMap(friend =>
        (friend.interactions || []).map(interaction => ({
          ...interaction,
          friend
        }))
      )
      .sort((a, b) => new Date(b.date) - new Date(a.date)); // newest first
  });
  
  // Only show the last 4 interactions initially
  const visibleInteractions = computed(() => {
    return allInteractions.value.slice(0, 4);
  });
  </script>