<template>
  <div
    class="min-h-[24rem] dark:bg-yellow-900/20 rounded-lg shadow-md overflow-hidden my-2 mb-4"
  >
    <!-- Chatbot window content -->
    <div class="p-4">
      <div
        ref="chatContainerRef"
        class="mb-4 h-64 overflow-y-auto overflow-x-hidden bg-gray-50 dark:bg-gray-900 rounded-lg p-3"
      >
        <div v-for="(message, index) in chatMessages" :key="index" class="mb-3">
          <!-- User message -->
          <div v-if="message.role === 'user'" class="flex justify-end">
            <div class="bg-primary text-white rounded-lg py-2 px-4 max-w-[90%]">
              {{ message.content }}
            </div>
          </div>
          <!-- AI message -->
          <div v-else class="flex justify-start">
            <div
              class="bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg py-2 px-4 max-w-[90%]"
            >
              <div v-if="message.isLoading" class="flex items-center">
                <div class="dot-flashing"></div>
              </div>
              <div
                v-else
                v-html="formatMessage(message.content)"
                class="markdown-body"
              ></div>
            </div>
          </div>
        </div>
      </div>

      <div class="flex items-center">
        <input
          ref="userInputRef"
          v-model="userInput"
          @keyup.enter="sendMessage"
          type="text"
          placeholder="Frage nach Freunden, Freizeitaktivitäten etc. ..."
          class="flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-800 dark:text-white dark:border-gray-700"
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
        <p class="text-xs pl-2 text-gray-500 dark:text-gray-400">
          Tipp: Schreibe "Events" oder "Julia", um Empfehlungen zu erhalten.
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick } from 'vue';
import { useFriendsStore } from '~/stores/friends';
import { marked } from 'marked';
import { useEvents } from '~/composables/useEvents';
const { fetchEvents, events } = useEvents();

const isLoading = ref(false);
const userInput = ref('');
const userInputRef = ref<HTMLInputElement | null>(null);
const chatContainerRef = ref<HTMLElement | null>(null);

type Event = {
  id: string;
  title: string;
  date: string;
  location: string;
  description: string;
  price: number | string;
  link: string;
};

let eventList: string = '';

type ChatMessage = {
  role: 'ai' | 'user';
  content: string;
  isLoading: boolean;
};

const chatMessages = ref<ChatMessage[]>([]);

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

// Format bot messages to detect and highlight URLs
const formatMessage = (message: string) => {
  // marked will convert Markdown and \n\n to <p> and single \n to <br> if needed
  return marked.parse(message);
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
    'Liste mit Freunden und Notizen:\n\n' +
    friendStore.friends
      .map((friend) => `${friend.name}: ${friend.notes};`)
      .join('\n')
  );
};

// Function to build the conversation context
const buildConversationContext = () => {
  const maxTokens = 1000; // API's token limit
  let context = '';
  const recentMessages = chatMessages.value.slice(-4); // Start with the last 3 messages

  for (const message of recentMessages) {
    const formattedMessage =
      message.role === 'user'
        ? `User: ${message.content}`
        : `AI: ${message.content}`;
    // truncate older messages to stay within the API's token limit
    if (context.length + formattedMessage.length > maxTokens) break;
    context += formattedMessage + '\n';
  }

  return context.trim();
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

  // Scroll to the bottom before the chatbot answered
  await nextTick();
  chatContainerRef.value?.scrollTo({
    top: chatContainerRef.value.scrollHeight,
    behavior: 'smooth',
  });

  // Add loading message
  chatMessages.value.push({
    role: 'ai',
    content: '',
    isLoading: true,
  });

  isLoading.value = true;

  try {
    const friendNotesContext = buildFriendNotesContext();

    // Prepare the final prompt
    const conversationContext = buildConversationContext();
    let basicPrompt = `\n\nUser: ${userQuestion} \n\nFriends data: ${friendNotesContext} \n\nConversation context: ${conversationContext} \n\nAI: `;
    let finalPrompt = basicPrompt;

    // Check if the user question contains a friend's name
    const matchingFriend = friendStore.friends.find((friend) => {
      const nameParts = friend.name.toLowerCase().split(' '); // Split the friend's name into parts
      return nameParts.some((part) =>
        userQuestion.toLowerCase().includes(part)
      );
    });

    if (matchingFriend) {
      finalPrompt += `
      Du bist ein deutscher Recommendation-Chatbot.
      \n\n Mache Vorschläge für die Kontaktaufnahme mit ${matchingFriend.name} basierend auf den
      Notizen \n\n ${matchingFriend.notes} \n\n Ansonsten beantworte seine Frage zu ${matchingFriend.name}\n\n und den Notizen \n\n${matchingFriend.notes}
      Bitte antworte in mehreren Absätzen. Beginne deine Antwort mit "OK."`;
    }

    console.log('Prompt with context: ', finalPrompt);
    console.log('\n\nPrompt length:', finalPrompt.length, ' characters');

    // Call the nuxt server's API with the final prompt
    const { text } = await $fetch('/api/chat', {
      method: 'POST',
      body: { prompt: finalPrompt },
    });

    // If the response contains #EVENTS_NEEDED, change prompt to contain eventList
    if (userQuestion.trim().toLowerCase().includes('events')) {
      basicPrompt += `\n\nEvents: ${eventList}`;
      const newPrompt = `
        Conversation context: ${finalPrompt}

         Bitte schlage dem User passende Events für ${
           matchingFriend?.name || 'seinen Freund'
         } vor und zeige sie im folgenden Format an: 
        <u><a href="{link}" target="_blank" class="text-blue-500">{title}</a></u>

        \n\nWenn keine passenden Events dabei sind, schreibe das bitte auch.
        Hier ist eine Liste mit Events (Titel und Link):\n\n
        ${eventList}
        `;

      const promptWithEvents = basicPrompt + newPrompt;
      // console.log(promptWithEvents);
      console.log('\n\nPrompt length:', promptWithEvents.length, ' characters');

      // send new prompt
      const { text: answerWithEvents } = await $fetch('/api/chat', {
        method: 'POST',
        body: { prompt: promptWithEvents },
      });

      // Antwort anzeigen
      chatMessages.value[chatMessages.value.length - 1] = {
        role: 'ai',
        content: answerWithEvents,
        isLoading: false,
      };
    } else {
      // Update chat with response
      chatMessages.value[chatMessages.value.length - 1] = {
        role: 'ai',
        content: text,
        isLoading: false,
      };
    }
  } catch (error: any) {
    console.error('Error getting response:', error);
    let errorMsg = 'Entschuldigung, es ist ein Fehler aufgetreten.';
    if (error?.response?.status === '429') {
      errorMsg =
        'Zu viele Anfragen. Bitte warte eine Minute und versuche es erneut.';
    } else if (error?.message) {
      errorMsg += ' ' + error.message;
    }
    chatMessages.value[chatMessages.value.length - 1] = {
      role: 'ai',
      content: errorMsg,
      isLoading: false,
    };
  } finally {
    isLoading.value = false;
  }
};

// Make initial API calls on app start
onMounted(async () => {
  // Fetch events on mount
  await fetchEvents();

  // Convert fetched events JSON Array into a string
  eventList = events.value
    .map((event: Event) => `${event.title}: ${event.link}`)
    .join(', ');
  console.log(
    '\n\nEventList length: ',
    eventList.length,
    ' characters'
  );
  // Check if there are any friends to contact and get a recommendation from the Google Gemini API
  const friendDue = getNextFriendToContact();
  if (friendDue) {
    // show photo of due friend
    chatMessages.value.push({
      role: 'ai',
      content: `<img src="${friendDue.photo}" height="96px" width="96px"/>`,
      isLoading: false,
    });

    // Add loading dots while waiting for the initial response
    chatMessages.value.push({
      role: 'ai',
      content: '',
      isLoading: true,
    });
    isLoading.value = true;

    const initialPrompt = `Du bist ein deutscher Recommendation-Chatbot. Schlage dem User eine Nachricht für die anstehende Kontaktaufnahme mit ${friendDue.name} vor.
    Nutze die Notizen ${friendDue.notes}.
    Bitte antworte in mehreren Absätzen. Beginne deine Antwort mit: Stay in touch!`;
    try {
      const { text } = await $fetch('/api/chat', {
        method: 'POST',
        body: { prompt: initialPrompt },
      });

      // Replace the loading message with the actual response
      chatMessages.value[chatMessages.value.length - 1] = {
        role: 'ai',
        content: text,
        isLoading: false,
      };
    } catch (error) {
      console.error('Error getting initial response:', error);
      chatMessages.value[chatMessages.value.length - 1] = {
        role: 'ai',
        content: 'Entschuldigung, es ist ein Fehler aufgetreten.',
        isLoading: false,
      };
    } finally {
      isLoading.value = false;
    }
  }
  // set focus on chatbot input field
  userInputRef.value?.focus();
});
</script>

<style scoped>
.markdown-body p {
  margin: 0 0 0.5em 0;
}
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
