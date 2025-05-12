<template>
  <div>
    <h2 class="text-xl font-semibold text-yellow-800 dark:text-yellow-500 mb-4">
      Zuletzt
    </h2>
    <div class="flex flex-wrap justify-around">
      <div
        v-for="friend in friends.slice(0, 4)"
        :key="'recent-photo-' + friend.id"
        class="relative cursor-pointer"
        @click="$emit('edit', friend)"
      >
        <div class="relative flex flex-col items-center">
          <img
            :src="friend.photo || 'https://i.imgur.com/tdi3NGa.png'"
            :alt="friend.name"
            class="w-16 h-16 md:w-20 md:h-20 rounded-full object-cover border-2 border-white dark:border-gray-800 shadow-md hover:shadow-lg transition-transform hover:scale-[1.20]"
          />
          <span class="text-sm text-gray-700 dark:text-gray-300 mt-1">{{
            getFirstName(friend.name)
          }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  friends: {
    type: Array,
    required: true,
  },
});

defineEmits(['edit']);

function getFirstName(fullName) {
  if (!fullName) return '';
  return fullName.split(' ')[0];
}
</script>
