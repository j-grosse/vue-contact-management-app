<template>
  <div class="border-2 border-gray-300 dark:border-gray-600 rounded-lg p-3 bg-white dark:bg-gray-800 shadow-md">
    <!-- Grid container -->
    <div class="grid grid-cols-7 gap-1">
      <div
        v-for="(day, index) in last14Days"
        :key="index"
        :class="[
          'w-3 h-3 rounded-sm',
          // Add dark border for the last cell (most recent day)
          index === 13 ? 'border-2 border-gray-500 dark:border-gray-400' : '',
          day.hasInteraction 
            ? 'bg-green-400 dark:bg-green-500' 
            : day.isWeekend
              ? 'bg-gray-400 dark:bg-gray-500'
              : 'bg-gray-200 dark:bg-gray-700'
        ]"
        :title="`${day.interactionCount} am ${day.weekday}. ${day.date}`"
      ></div>
    </div>
    
    <!-- Weekday labels below the grid -->
    <div class="grid grid-cols-7 gap-1">
      <div
        v-for="(weekday, index) in weekdayLabels"
        :key="index"
        class="w-3 h-3 text-center"
      >
        <span class="text-xs text-gray-500 dark:text-gray-400 font-medium">
          {{ weekday }}
        </span>
      </div>
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

// Weekday labels for the bottom row
const weekdayLabels = computed(() => {
  const today = new Date();
  const labels = [];
  
  // Get the last 7 days (bottom row of the 14-day grid)
  for (let i = 6; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    
    // Get German weekday abbreviation and take first letter
    const weekday = date.toLocaleDateString('de-DE', { 
      weekday: 'short' 
    });
    
    labels.push(weekday.charAt(0).toUpperCase());
  }
  
  return labels;
});
</script>