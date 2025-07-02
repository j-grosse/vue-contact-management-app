<template>
  <input
    type="file"
    ref="imageFileInput"
    class="hidden"
    accept="image/*"
    @change="handleFileUpload"
  />
  <div
    @click="imageFileInput?.click()"
    class="min-h-32 w-full rounded-lg overflow-hidden bg-gray-200 dark:bg-gray-700 cursor-pointer mb-4"
  >
    <img
      v-if="preview"
      :src="preview"
      class="w-full h-full object-cover"
      alt="Interaction photo"
    />
    <div
      v-else
      class="w-full h-full min-h-32 flex items-center justify-center text-gray-400"
    >
      <FontAwesomeIcon icon="fa-image" class="text-xl" />
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

const imageFileInput = ref(null);

const props = defineProps({
  modelValue: String
});
const emit = defineEmits(['update:modelValue']);

const preview = ref(props.modelValue || '');
watch(
  () => props.modelValue,
  (val) => {
    preview.value = val || '';
  }
);

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
      preview.value = canvas.toDataURL('image/jpeg', 0.85);
      emit('update:modelValue', preview.value);
    };
    img.src = e.target.result;
  };
  reader.readAsDataURL(file);
}
</script>