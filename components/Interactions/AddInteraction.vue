<template>
  <form @submit.prevent="submitInteraction" class="add-interaction flex flex-col justify-between mb-6 gap-3">
    <div class="flex w-full flex-col">
      <label class="block text-gray-700 dark:text-gray-300 mb-1"
        >Interaktion hinzufügen</label>
      <input 
        type="date" 
        v-model="date" 
        required 
        class="date-input border border-gray-300 text-lg block rounded-lg text-gray-700 dark:text-gray-300 dark:bg-gray-700 mb-2 p-2"
        />
      <div class="flex gap-2">
        <textarea 
          v-model="text" 
          placeholder="Interaktion..." 
          required
          class="border border-gray-300 text-input text-gray-700 dark:text-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-700 dark:caret-gray-300 px-3 py-2 w-full"
          >
        </textarea>
      </div>
    </div>

    <div class="relative flex flex-col items-start mb-4">
      <div class="flex w-full justify-between">
        <ImageUpload v-model="form.photo" />
        <div class="mt-auto">
          <button
            type="submit"
            class="submit-button px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 text-base px-4 py-2 ml-auto"
            >
            <FontAwesomeIcon icon="fa-floppy-disk" class="text-lg"/>
          </button>
        </div>
      </div>
    </div>
  </form>
</template>

<script setup>
import { ref, reactive } from 'vue';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import ImageUpload from '~/components/ImageUpload.vue';

const emit = defineEmits(['add']);
const date = ref(new Date().toISOString().split('T')[0]);
const text = ref('');

const imageFileInput = ref(null);

const form = reactive({
  photo: ''
});

const submitInteraction = () => {
  emit('add', {
    date: date.value,
    text: text.value,
    photo: form.photo
  });
  text.value = '';
  form.photo = '';
};

function handleFileUpload(event) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (e) => {
    const img = new Image();
    img.onload = () => {
      const maxSize = 256;
      let { width, height } = img;
      let newWidth = width;
      let newHeight = height;

      // Scale down if either dimension is greater than maxSize, but keep aspect ratio
      if (width > maxSize || height > maxSize) {
        if (width > height) {
          newWidth = maxSize;
          newHeight = Math.round((height / width) * maxSize);
        } else {
          newHeight = maxSize;
          newWidth = Math.round((width / height) * maxSize);
        }
      }

      const canvas = document.createElement('canvas');
      canvas.width = newWidth;
      canvas.height = newHeight;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, newWidth, newHeight);
      form.photo = canvas.toDataURL('image/jpeg', 0.60);
    };
    img.src = e.target.result;
  };
  reader.readAsDataURL(file);
}
</script>