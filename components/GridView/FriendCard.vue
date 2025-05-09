<template>
  <div
    class="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden transition-transform hover:shadow-lg hover:scale-[1.05] border border-gray-200 dark:border-gray-700 cursor-pointer"
    @click="$emit('edit', friend)"
  >
    <div class="relative">
      <img
        :src="friend.photo || 'https://i.imgur.com/tdi3NGa.png'"
        alt="Freund"
        class="w-full h-40 object-cover"
      />
      <div
        class="absolute top-0 left-0 right-0 bg-gradient-to-b from-black/70 to-transparent p-1"
      >
        <h3 class="text-xs font-semibold text-white truncate">
          {{ friend.name }}
        </h3>
      </div>
      <div
        class="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-1"
      >
        <div class="flex justify-between items-center">
          <span
            :class="getContactStatusClass(friend)"
            class="px-2 py-1 rounded-full text-xs font-medium"
          >
            {{ getContactStatus(friend) }}
          </span>
          <button
            @click.stop="$emit('contact', friend)"
            class="bg-primary hover:bg-primary/80 text-white w-7 h-7 rounded-full flex items-center justify-center"
            title="Als kontaktiert markieren"
          >
            <FontAwesomeIcon icon="fa-check" class="text-xs"></FontAwesomeIcon>
          </button>
        </div>
      </div>
    </div>

    <!-- <div class="p-1">
      <div class="flex justify-between items-center">
        <span
          :class="getContactStatusClass(friend)"
          class="px-1.5 py-0.5 rounded-full text-xs font-medium"
        >
          {{ getContactStatus(friend) }}
        </span>
        <button
          @click.stop="$emit('contact', friend)"
          class="bg-primary hover:bg-primary/80 text-white w-7 h-7 rounded-full flex items-center justify-center"
          title="Als kontaktiert markieren"
        >
          <FontAwesomeIcon icon="fa-check" class="text-xs"></FontAwesomeIcon>
        </button>
      </div>

      <div v-if="friend.notes" class="my-1">
        <p class="text-gray-600 dark:text-gray-300 text-xs line-clamp-2">
          {{ friend.notes }}
        </p>
      </div>
    </div> -->
  </div>
</template>

<script setup>
import { useUtils } from '~/composables/useUtils';

const { getContactStatus, getContactStatusClass } = useUtils();

defineProps({
  friend: {
    type: Object,
    required: true,
  },
});

defineEmits(['edit', 'contact']);
</script>
