<template>
  <div>
    <h2 class="text-xl font-semibold text-yellow-800 dark:text-yellow-500 mb-3">
      Anstehend
    </h2>
    <div class="space-y-3">
      <div
        v-for="friend in friends"
        :key="'upcoming-' + friend.id"
        class="bg-white dark:bg-gray-800 rounded-lg p-3 shadow-md hover:shadow-lg cursor-pointer transition-transform hover:scale-[1.05]"
        @click="$emit('edit', friend)"
      >
        <div class="flex items-start gap-3">
          <div class="flex flex-col text-center gap-2">
            <img
              :src="friend.photo || 'https://i.imgur.com/tdi3NGa.png'"
              alt="Freund"
              class="w-12 h-12 rounded-full object-cover"
            />
            <span
              :class="getContactStatusClass(friend)"
              class="px-2 py-1 rounded-lg text-xs font-medium"
            >
              {{ getContactStatus(friend) }}
            </span>
          </div>
          <div class="flex-1">
            <div class="flex justify-between items-start">
              <div class="font-medium text-gray-800 dark:text-gray-200">
                {{ friend.name }}
              </div>
              <span class="flex justify-end mt-1">
                <button
                  @click.stop="$emit('contact', friend)"
                  class="bg-primary hover:bg-primary/80 text-white w-8 h-8 rounded-full flex items-center justify-center"
                  title="Als kontaktiert markieren"
                >
                  <FontAwesomeIcon icon="fa-check"></FontAwesomeIcon>
                </button>
              </span>
            </div>
            <div
              v-if="friend.notes"
              class="mt-1 text-gray-600 dark:text-gray-400 text-sm line-clamp-2"
            >
              {{ friend.notes }}
            </div>
          </div>
        </div>
      </div>
      <div
        v-if="friends.length === 0"
        class="text-center py-3 text-gray-500 dark:text-gray-400"
      >
        Keine anstehenden Kontakte
      </div>
    </div>
  </div>
</template>

<script setup>
import { useUtils } from '~/composables/useUtils';

const { getContactStatus, getContactStatusClass } = useUtils();

defineProps({
  friends: {
    type: Array,
    required: true,
  },
});

defineEmits(['edit', 'contact']);
</script>
