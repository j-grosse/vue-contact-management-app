<template>
  <div>
    <div class="mb-4 flex justify-between gap-2">
      <div class="p-1 py-2">
        <InteractionsHistory />
      </div>
      <!-- <SearchBar v-if="appStore.viewMode === 'cards'" v-model="searchQuery" />
      <div v-else></div> -->
      <button
        @click="openAddFriendModal"
        class="bg-primary hover:bg-primary/80 text-white p-2 rounded-full flex items-center justify-center w-10 h-10"
        title="Friend hinzufügen"
      >
        <FontAwesomeIcon icon="fa-plus"></FontAwesomeIcon>
      </button>
    </div>

    <!-- Tab -->
    <div class="tabs flex justify-center gap-2 bg-gray-300 dark:bg-gray-700 border-2 border-gray-300 dark:border-gray-600 rounded-lg p-1">
          <button
            :class="[
              'w-1/2 py-2 rounded-lg font-medium transition-colors duration-150',
              activeTab === 'globalInteractions'
                ? 'bg-white dark:bg-gray-800 text-primary-500 dark:text-gray-300 shadow-md'
                : 'bg-transparent text-gray-600 dark:text-gray-300'
            ]"
            @click="activeTab = 'globalInteractions'"
            type="button"
          >
            Interaktionen
          </button>
          <button
            :class="[
              'w-1/2 py-2 rounded-lg font-medium transition-colors duration-150',
              activeTab === 'chatbot'
                ? 'bg-white dark:bg-gray-800 text-primary-500 dark:text-gray-300 shadow-md'
                : 'bg-transparent text-gray-600 dark:text-gray-300'
            ]"
            @click="activeTab = 'chatbot'"
            type="button"
          >
            Chatbot
          </button>
        </div>

        <!-- Interactions Tab active  -->
        <div v-show="activeTab === 'globalInteractions'">
          <GlobalInteractions @edit="editFriend"
            />  
        </div>

        <!-- Chatbot Tab active  -->
          <div v-show="activeTab === 'chatbot'">
            <Chatbot />
          </div>

    <TableView
      v-if="appStore.viewMode === 'table'"
      :upcoming-contacts="upcomingContacts"
      :recent-contacts="recentlyContactedFriends"
      @edit="editFriend"
      @contact="markAsContacted"
    />

    <GridView
      v-else
      :filtered-friends="filteredFriends"
      :recent-contacts="recentlyContactedFriends"
      @edit="editFriend"
      @contact="markAsContacted"
    />

    <EmptyState
      v-if="filteredFriends.length === 0"
      :search-query="searchQuery"
      @add="openAddFriendModal"
    />

    <!-- Modals -->
    <FriendModal
      v-if="friendStore.isFriendModalOpen"
      :editing="editingFriend"
      @close="closeModal"
      @save="saveFriend"
      @delete-request="confirmDeleteFriend"
    />

    <DeleteModal
      v-if="friendStore.showDeleteConfirmation"
      :friend="editingFriend"
      @close="closeModal"
      @confirm="deleteFriend"
    />

    <PreferencesModal
      v-if="appStore.isPreferencesModalOpen"
      @close="closeModal"
    />
  </div>
</template>

<script setup>
definePageMeta({
  layout: 'default',
});

import { ref, computed, onMounted } from 'vue';
import { useFriendsStore } from '~/stores/friends';
import { useAppStore } from '~/stores/app';
// import SearchBar from '~/components/SearchBar.vue';
import GridView from '~/components/GridView/index.vue';
import TableView from '~/components/TableView/index.vue';
import InteractionsHistory from '~/components/InteractionsHistory';
import EmptyState from '~/components/EmptyState.vue';
import FriendModal from '~/components/Modals/FriendModal.vue';
import DeleteModal from '~/components/Modals/DeleteModal.vue';
import PreferencesModal from '~/components/Modals/PreferencesModal.vue';
import Chatbot from '~/components/Chatbot';
import GlobalInteractions from '~/components/GlobalInteractions';
const friendStore = useFriendsStore();
const appStore = useAppStore();
import { useConfetti } from '~/composables/useConfetti';

const confettiBomb = useConfetti;

// Local state
const searchQuery = ref('');
const editingFriend = ref(null);

const activeTab = ref('globalInteractions');

// Initialize app
onMounted(() => {
  friendStore.initializeFriends();
  friendStore.saveFriendsToStorage();

  // Setup dark mode from user preferences
  if (
    import.meta.client &&
    window.matchMedia &&
    window.matchMedia('(prefers-color-scheme: dark)').matches
  ) {
    appStore.setDarkMode(true);
  }

  if (import.meta.client) {
    window
      .matchMedia('(prefers-color-scheme: dark)')
      .addEventListener('change', (event) => {
        appStore.setDarkMode(event.matches);
      });
  }
});

// Computed properties
const filteredFriends = computed(() => {
  let result = friendStore.friends;

  // Apply search filter
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    result = result.filter(
      (friend) =>
        friend.name.toLowerCase().includes(query) ||
        (friend.notes && friend.notes.toLowerCase().includes(query))
    );
  }

  // Sort by next contact date
  return [...result].sort((a, b) => {
    return new Date(a.nextContactDate) - new Date(b.nextContactDate);
  });
});

const upcomingContacts = computed(() => {
  return friendStore.getUpcomingContacts();
});

const recentlyContactedFriends = computed(() => {
  return friendStore.getRecentlyContactedFriends();
});

// Methods
const openAddFriendModal = () => {
  editingFriend.value = null;
  friendStore.resetFriendForm();
  friendStore.isFriendModalOpen = true;
};

const editFriend = (friend) => {
  editingFriend.value = friend;
  friendStore.isFriendModalOpen = true;
};

const closeModal = () => {
  friendStore.isFriendModalOpen = false;
  friendStore.showDeleteConfirmation = false;
  appStore.isPreferencesModalOpen = false;
};

const saveFriend = (formData) => {
  if (editingFriend.value) {
    friendStore.updateFriend(editingFriend.value.id, formData);
  } else {
    friendStore.addFriend(formData);
  }
  closeModal();
};

const confirmDeleteFriend = () => {
  friendStore.showDeleteConfirmation = true;
};

const deleteFriend = () => {
  if (editingFriend.value) {
    friendStore.deleteFriend(editingFriend.value.id);
  }
  closeModal();
};

const markAsContacted = (friend) => {
  if (friendStore.markAsContacted(friend.id)) {
    confettiBomb(friend);
  }
};
</script>
