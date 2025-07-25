<template>
    <div>
      <div class="grid grid-cols-7 gap-1">
        <div
          v-for="(day, index) in last14Days"
          :key="index"
          :class="[
            'w-3 h-3 rounded-sm',
            day.hasInteraction 
              ? 'bg-green-300 dark:bg-green-500' 
              : day.isWeekend
                ? 'bg-gray-400 dark:bg-gray-500'
                : 'bg-gray-200 dark:bg-gray-700'
          ]"
          :title="`${day.interactionCount} am ${day.weekday}. ${day.date}`"
        ></div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { computed } from 'vue';
  import { useFriendsStore } from '~/stores/friends';
  
  const friendsStore = useFriendsStore();
  
  const last14Days = computed(() => {
    const days = [];
    const today = new Date();
    
    for (let i = 13; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      
      const dateString = date.toISOString().split('T')[0];
      const interactionsOnDate = friendsStore.getInteractionsOnDate(dateString);
      const hasInteraction = friendsStore.hasInteractionOnDate(dateString);
      
      // Check if it's a weekend (Saturday = 6, Sunday = 0)
      const isWeekend = date.getDay() === 0 || date.getDay() === 6;
      
      days.push({
        date: date.toLocaleDateString('de-DE', { 
          day: '2-digit', 
          month: '2-digit' 
        }),
        weekday: date.toLocaleDateString('de-DE', { 
        weekday: 'short' 
        }),
        hasInteraction,
        interactionCount: interactionsOnDate.length,
        isWeekend

      });
    }
    
    return days;
  });
  </script>