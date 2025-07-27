<template>
  <div class="items-center">
    <div 
      :class="[
        'text-2xl transition-all duration-300 mt-3 pr-1 flex gap-2',
        gamificationIcon.class
      ]"
      :title="gamificationIcon.title"
    >
      <span>{{ gamificationIcon.emoji }}</span>
      <span>{{ interactionsLast7Days }}</span>
  </div>

  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useFriendsStore } from '~/stores/friends';

const friendsStore = useFriendsStore();

const interactionsLast7Days = computed(() => {
  const today = new Date();
  let totalInteractions = 0;
  
  for (let i = 0; i < 7; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    const dateString = date.toISOString().split('T')[0];
    const interactionsOnDate = friendsStore.getInteractionsOnDate(dateString);
    totalInteractions += interactionsOnDate.length;
  }
  
  return totalInteractions;
});

const gamificationIcon = computed(() => {
  const count = interactionsLast7Days.value;
  
  if (count >= 3) {
    return {
      emoji: '🏆',
      class: 'text-green-500 dark:text-green-400',
      title: 'Ausgezeichnet! 3 oder mehr Interaktionen in den letzten 7 Tagen'
    };
  } else if (count >= 2) {
    return {
      emoji: '😃',
      class: 'text-green-500 dark:text-green-400',
      title: 'Gut gemacht! 2 Interaktionen in den letzten 7 Tagen'
    };
  }else if (count >= 1) {
    return {
      emoji: '🙂',
      class: 'text-yellow-500 dark:text-yellow-400',
      title: 'Gut gemacht! 1 Interaktion in den letzten 7 Tagen'
    };
  } else {
    return {
      emoji: '🙁',
      class: 'text-red-500 dark:text-red-400',
      title: 'Keine Interaktionen in den letzten 7 Tagen - Zeit für Kontakt!'
    };
  }
});
</script>
