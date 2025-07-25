<template>
  <div class="flex gap-2 items-center">
    <FontAwesomeIcon 
      :icon="gamificationIcon.icon" 
      :class="[
        'text-2xl transition-all duration-300',
        gamificationIcon.class
      ]"
      :title="gamificationIcon.title"
    />
    <span class="text-xs text-gray-500 dark:text-gray-400 mt-1">
      {{ interactionsLast7Days }}
    </span>
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
      icon: 'fa-trophy',
      class: 'text-yellow-500 dark:text-yellow-400',
      title: 'Ausgezeichnet! 3 oder mehr Interaktionen in den letzten 7 Tagen'
    };
  } else if (count >= 2) {
    return {
      icon: 'fa-face-smile',
      class: 'text-green-500 dark:text-green-400',
      title: 'Gut gemacht! 1-2 Interaktionen in den letzten 7 Tagen'
    };
} else if (count >= 1) {
    return {
      icon: 'fa-face-meh',
      class: 'text-green-500 dark:text-green-400',
      title: 'Gut gemacht! 1-2 Interaktionen in den letzten 7 Tagen'
    };
  } else {
    return {
      icon: 'fa-face-frown',
      class: 'text-red-500 dark:text-red-400',
      title: 'Keine Interaktionen in den letzten 7 Tagen - Zeit für Kontakt!'
    };
  }
});
</script>
