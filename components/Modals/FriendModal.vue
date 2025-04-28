<template>
  <div
    class="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
    @click="$emit('close')"
  >
    <div
      class="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md mx-auto overflow-hidden"
      @click.stop
    >
      <div class="p-6">
        <h2 class="text-2xl font-bold text-gray-800 dark:text-white mb-4">
          {{ editing ? 'Freund bearbeiten' : 'Freund hinzufügen' }}
        </h2>

        <form @submit.prevent="saveForm">
          <div class="space-y-4">
            <!-- Photo preview and upload -->
            <div class="relative flex flex-col items-center">
              <div
                class="w-32 h-32 rounded-full overflow-hidden bg-gray-200 dark:bg-gray-700 mb-2"
              >
                <img
                  v-if="form.photo"
                  :src="form.photo"
                  class="w-full h-full object-cover"
                  alt="Freund"
                />
                <div
                  v-else
                  class="w-full h-full flex items-center justify-center text-gray-400"
                >
                  <FontAwesomeIcon
                    icon="fa-user"
                    class="text-3xl"
                  ></FontAwesomeIcon>
                </div>

                <!-- Photo upload and conversion -->
                <div
                  class="absolute bottom-0 left-24 right-0 flex flex-col items-center gap-2"
                >
                  <!-- Hidden file input -->
                  <input
                    type="file"
                    @change="handleFileUpload"
                    ref="imageFileInput"
                    class="hidden"
                    accept="image/*"
                  />
                  <button
                    type="button"
                    @click="imageFileInput?.click()"
                    class="bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 border border-gray-300 dark:border-gray-600 p-2 rounded-full flex items-center justify-center w-10 h-10 text-gray-800 dark:text-gray-200 mb-2"
                    title="Profilbild importieren"
                  >
                    <FontAwesomeIcon icon="fa-image"></FontAwesomeIcon>
                  </button>
                  <!-- <span class="text-center dark:text-white">Profilbild importieren</span> -->
                </div>
              </div>
            </div>

            <div>
              <label class="block text-gray-700 dark:text-gray-300 mb-1"
                >Photo URL</label
              >
              <input
                type="text"
                v-model="form.photo"
                placeholder="Foto URL eingeben"
                class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-700 dark:text-white dark:border-gray-600 text-base"
              />
            </div>

            <!-- Name -->
            <div>
              <label class="block text-gray-700 dark:text-gray-300 mb-1"
                >Name*</label
              >
              <input
                type="text"
                v-model="form.name"
                placeholder="Name eingeben"
                required
                class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-700 dark:text-white dark:border-gray-600 text-base"
              />
            </div>

            <!-- Notes -->
            <div>
              <label class="block text-gray-700 dark:text-gray-300 mb-1"
                >Notizen</label
              >
              <textarea
                v-model="form.notes"
                placeholder="Notizen zu diesem Freund"
                rows="3"
                class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-700 dark:text-white dark:border-gray-600 text-base"
              ></textarea>
            </div>

            <!-- Last Contact Date -->
            <div>
              <label class="block text-gray-700 dark:text-gray-300 mb-1"
                >Letzter Kontakt*</label
              >
              <input
                type="date"
                v-model="form.lastContactDate"
                required
                class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-700 dark:text-white dark:border-gray-600 text-base"
              />
            </div>

            <!-- Contact Interval -->
            <div>
              <label class="block text-gray-700 dark:text-gray-300 mb-1"
                >Kontaktintervall (Tage)*</label
              >
              <input
                type="number"
                v-model="form.contactInterval"
                min="1"
                required
                class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-700 dark:text-white dark:border-gray-600 text-base"
              />
            </div>
          </div>

          <div class="flex justify-between mt-6">
            <button
              v-if="editing"
              type="button"
              @click="$emit('delete-request')"
              class="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-base flex items-center"
            >
              <FontAwesomeIcon icon="fa-trash" class="mr-2"></FontAwesomeIcon>
            </button>
            <button v-if="!editing"></button>
            <div class="flex justify-between gap-3">
              <div class="flex gap-3">
                <button
                  type="button"
                  @click="$emit('close')"
                  class="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 text-base"
                >
                  <FontAwesomeIcon icon="fa-times" />
                </button>
                <button
                  type="submit"
                  class="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 text-base"
                >
                  <FontAwesomeIcon icon="fa-check" />
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import { useFriendsStore } from '~/stores/friends';

const props = defineProps({
  editing: {
    type: Object,
    default: null,
  },
});

const emit = defineEmits(['close', 'save', 'delete-request']);
const friendsStore = useFriendsStore();
const imageFileInput = ref(null);

// Form state
const form = reactive({
  id: null,
  name: '',
  photo: '',
  notes: '',
  lastContactDate: new Date().toISOString().split('T')[0],
  contactInterval: 30,
});

// Initialize form with editing data if available
onMounted(() => {
  if (props.editing) {
    Object.assign(form, props.editing);
  }
});

// Calculate next contact date and prepare the form data for saving
const saveForm = () => {
  const lastContactDate = new Date(form.lastContactDate);
  const nextContactDate = new Date(lastContactDate);
  nextContactDate.setDate(
    lastContactDate.getDate() + parseInt(form.contactInterval)
  );

  emit('save', {
    ...form,
    nextContactDate: nextContactDate.toISOString().split('T')[0],
  });
};

// Handle file upload for profile picture
const handleFileUpload = (event) => {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (e) => {
    const img = new Image();
    img.onload = () => {
      // Create canvas to resize the image
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      // Set canvas dimensions to 96x96
      canvas.width = 96;
      canvas.height = 96;

      // Draw the image onto the canvas
      ctx.drawImage(img, 0, 0, 96, 96);

      // Convert canvas to Base64 string
      const base64String = canvas.toDataURL('image/jpeg');

      // Set the base64 string to form.photo
      form.photo = base64String;

      // alert('Profilbild wurde importiert!');
    };
    img.src = e.target.result;
  };

  reader.readAsDataURL(file);
};
</script>
