<template>
  <div class="chatbot">
    <div class="messages">
      <div v-for="(msg, idx) in messages" :key="idx" :class="msg.role">
        <strong>{{ msg.role === 'user' ? 'You' : 'AI' }}:</strong>
        {{ msg.text }}
      </div>
    </div>
    <form @submit.prevent="sendMessage">
      <input v-model="input" placeholder="Ask a recipe question..." />
      <button type="submit">Send</button>
    </form>^
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const input = ref('');
const messages = ref<{ role: string; text: string }[]>([]);

const sendMessage = async () => {
  if (!input.value.trim()) return;
  messages.value.push({ role: 'user', text: input.value });

  const { text } = await $fetch('/api/chat', {
    method: 'POST',
    body: { prompt: input.value },
  });
  messages.value.push({ role: 'ai', text });
  input.value = '';
};
</script>

<style scoped>
.chatbot {
  max-width: 500px;
  margin: 2rem auto;
  border: 1px solid #ccc;
  padding: 1rem;
  border-radius: 8px;
}
.messages {
  min-height: 200px;
  margin-bottom: 1rem;
}
.user {
  text-align: right;
  color: #333;
}
.ai {
  text-align: left;
  color: #007bff;
}
form {
  display: flex;
  gap: 0.5rem;
}
input {
  flex: 1;
  padding: 0.5rem;
}
button {
  padding: 0.5rem 1rem;
}
</style>
