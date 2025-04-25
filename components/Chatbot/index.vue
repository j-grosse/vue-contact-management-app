<template>
  <!-- Chatbot window -->
  <div
    class="bg-white dark:bg-yellow-900/20 rounded-lg shadow-md overflow-hidden my-2"
  >
    <div
      class="p-4 bg-primary text-white rounded-t-lg flex justify-between items-center"
    >
      <h3 class="font-semibold">Kontaktassistent</h3>
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
              <!-- <button @click="" class="text-white hover:text-gray-200">
                <FontAwesomeIcon icon="fa-repeat" class="text-black dark:text-white" />
              </button> -->
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
          Tipps: Frage nach "Anna Schmidt" oder "Idee für 3 Freunde"
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useFriendsStore } from '~/stores/friends';

const isOpen = ref(true);
const isLoading = ref(false);
const userInput = ref('');

type ChatMessage = {
  role: 'ai' | 'user';
  content: string;
  isLoading: boolean;
};

const chatMessages = ref<ChatMessage[]>([
  {
    role: 'ai',
    content: 'Hallo!',
    isLoading: false,
  },
]);

type Friend = {
  id: number;
  name: string;
  photo: string;
  notes: string;
  lastContactDate: Date;
  contactInterval: number;
  nextContactDate: Date;
};
const friendStore = useFriendsStore() as { friends: Friend[] };

let initialAnswerGiven = false;

// Format bot messages to detect and highlight URLs
const formatMessage = (message: any) => {
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  return message.replace(
    urlRegex,
    (url: string) =>
      `<a href="${url}" target="_blank" class="text-primary underline">${url}</a>`
  );
};

// Function to determine the next friend to contact
const getNextFriendToContact = () => {
  return friendStore.friends.slice().sort((a, b) => {
    return (
      new Date(a.nextContactDate).getTime() -
      new Date(b.nextContactDate).getTime()
    );
  })[0];
};

// Function to build the friend notes context
const buildFriendNotesContext = () => {
  return (
    'Freunde und Notizen:\n' +
    friendStore.friends
      .map((friend) => `${friend.name}: ${friend.notes}`)
      .join('\n')
  );
};

// Function to send a message to the chatbot
const sendMessage = async () => {
  if (!userInput.value.trim() || isLoading.value) return;

  // Add user message to chat
  chatMessages.value.push({
    role: 'user',
    content: userInput.value,
    isLoading: false,
  });

  // Clear input
  const userQuestion = userInput.value;
  userInput.value = '';

  // Add loading message
  chatMessages.value.push({
    role: 'ai',
    content: '',
    isLoading: true,
  });

  isLoading.value = true;

  try {
    // Prepare the final prompt
    let finalPrompt = userQuestion;

    // Check if the user question contains a friend's name
    const friendNotesContext = buildFriendNotesContext();
    const matchingFriend = friendStore.friends.find((friend) => {
      const nameParts = friend.name.toLowerCase().split(' '); // Split the friend's name into parts
      return nameParts.some((part) =>
        userQuestion.toLowerCase().includes(part)
      );
    });

    if (matchingFriend) {
      finalPrompt = `Du bist ein deutscher Recommendation-Chatbot. 
       Falls der User etwas zu dem Freund gefragt hat beantworte diese Frage: ${userQuestion}. Ansonsten Empfehle dem User seinen Kontakt mit dem Namen ${matchingFriend.name} zu kontaktieren und gib einen Vorschlag für eine Nachricht aufgrund der folgenden Notizen zum letzten Gespräch mit dem Freund:
      Notizen: ${matchingFriend.notes}
     
      Bitte antworte in mehreren Absätzen. Beginne deine Antwort mit "OK."`;
    } else {
      finalPrompt = `Du bist ein deutscher Recommendation-Chatbot. Beantworte die folgende Frage:
      
      Frage: ${userQuestion}`;
    }

    // Call the nuxt server's API with the final prompt
    const { text } = await $fetch('/api/chat', {
      method: 'POST',
      body: { prompt: finalPrompt },
    });

    // Update chat with response
    chatMessages.value[chatMessages.value.length - 1] = {
      role: 'ai',
      content: text,
      isLoading: false,
    };
  } catch (error) {
    console.error('Error getting response:', error);
    chatMessages.value[chatMessages.value.length - 1] = {
      role: 'ai',
      content: 'Entschuldigung, es ist ein Fehler aufgetreten.',
      isLoading: false,
    };
  } finally {
    isLoading.value = false;
  }
};

// Make an initial API call on app start
onMounted(async () => {
  const friendDue = getNextFriendToContact();
  if (friendDue) {
    const initialPrompt = `Du bist ein deutscher Recommendation-Chatbot. Empfehle dem User seinen Kontakt mit dem Namen ${friendDue.name} zu kontaktieren und gib einen Vorschlag für eine Nachricht aufgrund der folgenden Notizen zum letzten Gespräch mit dem Freund:
    
    ${friendDue.notes}
    
    Bitte antworte in mehreren Absätzen. Beginne deine Antwort mit: Stay in touch!`;

    try {
      const { text } = await $fetch('/api/chat', {
        method: 'POST',
        body: { prompt: initialPrompt },
      });

      // Add the initial response to the chat
      chatMessages.value.push({
        role: 'ai',
        content: text,
        isLoading: false,
      });

      initialAnswerGiven = true;
    } catch (error) {
      console.error('Error getting initial response:', error);
    }
  }
});
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
