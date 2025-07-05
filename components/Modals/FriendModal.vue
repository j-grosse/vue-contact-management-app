<template>
  <div
    class="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
    @click="handleClose"
  >
    <div
      class="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md mx-auto overflow-hidden overflow-y-auto flex flex-col h-[44rem] pt-4 px-4 max-h-[80vh]"
      @click.stop
    >
      <!-- Header and content area -->
      <div class="flex-1">
        <h2 class="text-2xl font-bold text-gray-800 dark:text-white mb-4">
          {{ editing ? 'Friend bearbeiten' : 'Friend hinzufügen' }}
        </h2>

        <!-- Tab -->
        <div class="tabs flex justify-center gap-2 bg-gray-300 dark:bg-gray-700 border-2 border-gray-300 dark:border-gray-600 rounded-lg p-1 mb-4">
          <button
            :class="[
              'w-1/2 py-2 rounded-lg font-medium transition-colors duration-150',
              activeTab === 'interactions'
                ? 'bg-white dark:bg-gray-800 text-primary-500 dark:text-gray-300 shadow-md'
                : 'bg-transparent text-gray-600 dark:text-gray-300'
            ]"
            @click="activeTab = 'interactions'"
            type="button"
          >
            Interaktionen
          </button>
          <button
            :class="[
              'w-1/2 py-2 rounded-lg font-medium transition-colors duration-150',
              activeTab === 'info'
                ? 'bg-white dark:bg-gray-800 text-primary-500 dark:text-gray-300 shadow-md'
                : 'bg-transparent text-gray-600 dark:text-gray-300'
            ]"
            @click="activeTab = 'info'"
            type="button"
          >
            Info
          </button>
        </div>

        <!-- Interactions Tab active  -->
        <div v-if="activeTab === 'interactions'">
          <AddInteraction @add="addNewInteraction" />
          <InteractionList 
            :interactions="form.interactions" 
            @delete="deleteInteraction"
            @edit="editInteraction"
          />
        </div>

        <!-- Info Tab active  -->
        <div v-if="activeTab === 'info'">
          <form @submit.prevent="saveForm">
            <div class="space-y-4">
              <!-- Photo preview and upload -->
              <div class="relative flex flex-col items-center">
                <div
                  @click="imageFileInput?.click()"
                  class="w-24 h-24 rounded-full overflow-hidden bg-gray-200 dark:bg-gray-700 mb-0 cursor-pointer"
                >
                  <img
                    v-if="form.photo"
                    :src="form.photo"
                    class="w-full h-full object-cover"
                    alt="Friend"
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

              <!--               
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
              -->

              <!-- Name -->
              <div>
                <label class="block text-gray-700 dark:text-gray-300 mb-1"
                  >Name</label
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
                  placeholder="Notizen zu diesem Friend"
                  rows="1"
                  class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-700 dark:text-white dark:border-gray-600 text-base"
                ></textarea>
              </div>

              <div class="flex justify-between gap-3">
                <!-- Last Contact Date -->
                <div>
                  <label class="block text-gray-700 dark:text-gray-300 mb-1"
                    >Letzter Kontakt</label
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
                    >Intervall</label
                  >
                  <input
                    type="number"
                    v-model="form.contactInterval"
                    min="1"
                    required
                    class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-700 dark:text-white dark:border-gray-600 text-base text-right"
                  />
                </div>
              </div>
            </div>
          </form>
        </div>

      </div>

      <!-- Fixed bottom buttons -->
      <div class="py-4 bg-white dark:bg-gray-800">
        <div class="flex justify-between">
          <button
            v-if="editing && activeTab === 'info'"
            type="button"
            @click="$emit('delete-request')"
            class="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-base flex items-center"
          >
            <FontAwesomeIcon icon="fa-trash"></FontAwesomeIcon>
          </button>
          <div v-if="editing && activeTab === 'interactions'"></div>
          <div v-else=""></div>
          <div class="flex justify-between gap-3">
            <button
              type="button"
              @click="handleClose"
              class="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 text-base"
            >
              <FontAwesomeIcon icon="fa-times" />
            </button>
            <button
              type="button"
              @click="saveForm"
              class="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 text-base"
            >
              <FontAwesomeIcon icon="fa-check" />
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, onBeforeUnmount } from 'vue';
import { useFriendsStore } from '~/stores/friends';
import InteractionList from '~/components/Interactions/InteractionList.vue';
import AddInteraction from '~/components/Interactions/AddInteraction.vue';

const props = defineProps({
  editing: {
    type: Object,
    default: null,
  },
});

const emit = defineEmits(['close', 'save', 'delete-request']);
const friendsStore = useFriendsStore();
const imageFileInput = ref(null);
const activeTab = ref('info');

// Form state
const form = reactive({
  id: null,
  name: '',
  photo: '',
  notes: '',
  lastContactDate: new Date().toISOString().split('T')[0],
  contactInterval: 30,
  interactions: [],
});

function resetForm() {
  form.id = null;
  form.name = '';
  form.photo = '';
  form.notes = '';
  form.lastContactDate = new Date().toISOString().split('T')[0];
  form.contactInterval = 30;
  form.interactions = [];
}

// Initialize form with editing data if available
onMounted(() => {
  document.body.classList.add('modal-open');
  if (props.editing) {
    const { interactions, ...otherProps } = props.editing;
    Object.assign(form, otherProps);
    form.interactions = interactions ? [...interactions] : [];
    activeTab.value = 'interactions';
  } else {
    resetForm();
    activeTab.value = 'info';
  }
});

onBeforeUnmount(() => {
  document.body.classList.remove('modal-open');
});

// Calculate next contact date and prepare the form data for saving
const saveForm = () => {
  const lastContactDate = new Date(form.lastContactDate);
  const nextContactDate = new Date(lastContactDate);
  nextContactDate.setDate(
    lastContactDate.getDate() + parseInt(form.contactInterval)
  );

  // Create the friend data object with all properties including interactions
  const friendData = {
    ...form,
    nextContactDate: nextContactDate.toISOString().split('T')[0],
    interactions: form.interactions || [] // Ensure interactions array exists
  };

  // If we're editing, update the friend in the store
  if (props.editing) {
    friendsStore.updateFriend(props.editing.id, friendData);
  } else {
    // If we're creating a new friend, add them to the store
    friendsStore.addFriend(friendData);
  }

  // Emit the save event with the complete data
  emit('save', friendData);
};

// Handle file upload for profile picture (image to Base64)
const handleFileUpload = (event) => {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (e) => {
    const img = new Image();
    img.onload = () => {
      const cropSize = 128;
      const { width, height } = img;

      // Calculate scale to cover the crop area (center crop, cover style)
      const scale = Math.max(cropSize / width, cropSize / height);

      const scaledWidth = width * scale;
      const scaledHeight = height * scale;

      // Calculate offset to center the image
      const offsetX = (cropSize - scaledWidth) / 2;
      const offsetY = (cropSize - scaledHeight) / 2;

      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      canvas.width = cropSize;
      canvas.height = cropSize;

      // Draw the scaled and centered image
      ctx.drawImage(img, offsetX, offsetY, scaledWidth, scaledHeight);
      const imageData = ctx.getImageData(0, 0, cropSize, cropSize);
      ctx.putImageData(imageData, 0, 0);

      // Use JPEG for smaller base64 size
      form.photo = canvas.toDataURL('image/jpeg', 0.85);
    };
    img.src = e.target.result;
  };

  reader.readAsDataURL(file);
};

const addNewInteraction = (interaction) => {
  if (!form.interactions) {
    form.interactions = [];
  }
  form.interactions.push({
    id: Date.now().toString(),
    date: interaction.date,
    text: interaction.text,
    photo: interaction.photo
  });
  
  // Update the store if editing an existing friend
  if (props.editing) {
    friendsStore.updateFriend(props.editing.id, {
      ...form,
      interactions: form.interactions
    });
  }
};

const deleteInteraction = (interactionId) => {
  // Remove the interaction from the form
  form.interactions = form.interactions.filter(i => i.id !== interactionId);
  
  // Update the store if we're editing an existing friend
  if (props.editing) {
    friendsStore.updateFriend(props.editing.id, {
      ...form,
      interactions: form.interactions
    });
  }
};

const editInteraction = (editedInteraction) => {
  // Find and update the interaction in the form
  const index = form.interactions.findIndex(i => i.id === editedInteraction.id);
  if (index !== -1) {
    form.interactions[index] = {
      ...form.interactions[index],
      date: editedInteraction.date,
      text: editedInteraction.text,
      photo: editedInteraction.photo
    };
    
    // Update the store if we're editing an existing friend
    if (props.editing) {
      friendsStore.updateFriend(props.editing.id, {
        ...form,
        interactions: form.interactions
      });
    }
  }
};

const handleClose = () => {
  resetForm();
  emit('close');
};
</script>
