<template>
  <!-- Chatbot window -->
  <div
    class="bg-white dark:bg-yellow-900/20 rounded-lg shadow-md overflow-hidden my-2"
  >
    <div
      class="p-4 bg-primary text-white rounded-t-lg flex justify-between items-center"
    >
      <h3 class="font-semibold">Freizeitberater</h3>
      <button @click="isOpen = !isOpen" class="text-white hover:text-gray-200">
        <FontAwesomeIcon
          :icon="isOpen ? 'fa-chevron-down' : 'fa-chevron-up'"
        ></FontAwesomeIcon>
      </button>
    </div>

    <div v-if="isOpen" class="p-4">
      <div
        class="mb-4 h-64 overflow-y-auto bg-gray-50 dark:bg-gray-900 rounded-lg p-3"
      >
        <div v-for="(message, index) in chatMessages" :key="index" class="mb-3">
          <!-- User message -->
          <div v-if="message.role === 'user'" class="flex justify-end">
            <div class="bg-primary text-white rounded-lg py-2 px-4 max-w-[80%]">
              {{ message.content }}
            </div>
          </div>

          <!-- Bot message -->
          <div v-else class="flex justify-start">
            <div
              class="bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg py-2 px-4 max-w-[80%]"
            >
              <div v-if="message.isLoading" class="flex items-center">
                <div class="dot-flashing"></div>
              </div>
              <div v-else v-html="formatMessage(message.content)"></div>
              Events:
              <button
                @click="handleEventCategoryClick('ausstellung')"
                class="text-white hover:text-gray-200"
              >
                <FontAwesomeIcon icon="fa-cocktail" class="text-black" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div class="flex items-center">
        <input
          v-model="userInput"
          @keyup.enter="sendMessage"
          type="text"
          placeholder="Frage nach Freizeitaktivitäten..."
          class="flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-800 dark:text-white dark:border-gray-700"
          :disabled="isLoading"
        />
        <button
          @click="sendMessage"
          class="ml-2 bg-primary hover:bg-primary/80 text-white p-2 rounded-full flex items-center justify-center w-10 h-10"
          :disabled="isLoading"
        >
          <FontAwesomeIcon icon="fa-paper-plane"></FontAwesomeIcon>
        </button>
      </div>

      <div class="mt-3">
        <p class="text-xs text-gray-500 dark:text-gray-400">
          Tipps: Frage nach "Konzerte dieses Wochenende" oder "Idee für 3
          Freunde"
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useEvents } from '~/composables/useEvents';

const isOpen = ref(true);
const userInput = ref('');
const chatMessages = ref([
  {
    role: 'assistant',
    content:
      'Hallo! Ich kann dir helfen, tolle Aktivitäten zu finden. Was hättet ihr gerne unternommen?',
  },
]);
const isLoading = ref(false);
const { fetchEvents, events } = useEvents();
const dailyRequestLimit = ref(1500);
const remainingRequests = ref(1500);

// Check local storage for remaining daily requests
onMounted(async () => {
  if (process.client) {
    const today = new Date().toDateString();
    const lastRequestDate = localStorage.getItem('lastRequestDate');
    const requestsLeft = localStorage.getItem('remainingRequests');

    if (lastRequestDate === today && requestsLeft) {
      remainingRequests.value = parseInt(requestsLeft);
    } else {
      // Reset if it's a new day
      localStorage.setItem('lastRequestDate', today);
      localStorage.setItem(
        'remainingRequests',
        dailyRequestLimit.value.toString()
      );
    }
  }

  // Fetch events on mount
  await fetchEvents();
  // console.log(events.value);
});

const handleEventCategoryClick = (category) => {
  userInput.value = category;
  sendMessage();
};

// Format bot messages to detect and highlight URLs
const formatMessage = (message) => {
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  return message.replace(
    urlRegex,
    (url) =>
      `<a href="${url}" target="_blank" class="text-primary underline">${url}</a>`
  );
};

// Send user message and get response
const sendMessage = async () => {
  if (!userInput.value.trim() || isLoading.value) return;

  // Add user message to chat
  chatMessages.value.push({
    role: 'user',
    content: userInput.value,
  });

  // Clear input
  const userQuestion = userInput.value;
  userInput.value = '';

  // Add loading message
  chatMessages.value.push({
    role: 'assistant',
    content: '',
    isLoading: true,
  });

  isLoading.value = true;

  try {
    // Check if we have requests remaining
    if (remainingRequests.value <= 0) {
      chatMessages.value[chatMessages.value.length - 1] = {
        role: 'assistant',
        content:
          'Entschuldigung, ich habe mein tägliches Limit erreicht. Hier sind einige Standard-Empfehlungen:\n\n' +
          '• Gemeinsames Picknick im Park\n' +
          '• Filmabend zu Hause\n' +
          '• Städtische Museen und Galerien besuchen\n' +
          '• Kochabend mit Freunden\n' +
          '• Brettspielabend organisieren',
      };
    } else {
      // Filter events based on user query
      console.log(events.value);
      const filteredEvents = events.value.filter(
        (event) =>
          (event.title &&
            event.title.toLowerCase().includes(userQuestion.toLowerCase())) ||
          (event.location &&
            event.location.toLowerCase().includes(userQuestion.toLowerCase()))
      );

      let response;
      if (filteredEvents.length > 0) {
        // Remove duplicate events using findIndex
        const uniqueEvents = filteredEvents.filter((event, index, self) => {
          return index === self.findIndex((e) => e.title === event.title);
        });

        response =
          'Hier sind einige passende Veranstaltungen: <br/>' +
          uniqueEvents
            .map(
              (event) =>
                `• ${event.title} am ${new Date(event.date).toLocaleDateString(
                  'de-DE'
                )} in ${event.location}`
            )
            .join('<br>');
      } else {
        response =
          'Entschuldigung, ich konnte keine passenden Veranstaltungen finden.';
      }

      // Update chat with response
      chatMessages.value[chatMessages.value.length - 1] = {
        role: 'assistant',
        content: response,
      };

      // Decrement remaining requests
      remainingRequests.value--;
      if (process.client) {
        localStorage.setItem(
          'remainingRequests',
          remainingRequests.value.toString()
        );
      }
    }
  } catch (error) {
    console.error('Error getting response:', error);
    chatMessages.value[chatMessages.value.length - 1] = {
      role: 'assistant',
      content: 'Entschuldigung, es ist ein Fehler aufgetreten.',
    };
  } finally {
    isLoading.value = false;
  }
};
</script>

<style scoped>
/* Typing indicator animation */
.dot-flashing {
  position: relative;
  width: 10px;
  height: 10px;
  border-radius: 5px;
  background-color: #5d5cde;
  color: #5d5cde;
  animation: dot-flashing 1s infinite linear alternate;
  animation-delay: 0.5s;
}
.dot-flashing::before,
.dot-flashing::after {
  content: '';
  display: inline-block;
  position: absolute;
  top: 0;
}
.dot-flashing::before {
  left: -15px;
  width: 10px;
  height: 10px;
  border-radius: 5px;
  background-color: #5d5cde;
  color: #5d5cde;
  animation: dot-flashing 1s infinite alternate;
  animation-delay: 0s;
}
.dot-flashing::after {
  left: 15px;
  width: 10px;
  height: 10px;
  border-radius: 5px;
  background-color: #5d5cde;
  color: #5d5cde;
  animation: dot-flashing 1s infinite alternate;
  animation-delay: 1s;
}

@keyframes dot-flashing {
  0% {
    background-color: #5d5cde;
  }
  50%,
  100% {
    background-color: rgba(93, 92, 222, 0.2);
  }
}
</style>


