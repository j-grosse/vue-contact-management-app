<template>
  <div class="splash-screen-overlay" v-if="visible">
    <div
      class="app-min-width fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50"
      @click="closeModal()"
    >
      <div
        class="modal-style p-4 text-gray-600 dark:text-gray-300"
        @click.stop
      >
        <h3 class="text-xl font-bold my-4">
          Willkommen bei FriendCare!
        </h3>
        <p class="mb-4">
          Diese App erinnert dich daran deine Friends und Bekannten regelmäßig
          zu kontaktieren. Füge einen Friend und seine Interessen hinzu und lege
          ein Kontaktintervall fest. Die App wird dich dann regelmäßig daran
          erinnern dich zu melden.
          <br />Wenn du mit einem Friend interagiert hast kannst du dies
          eintragen und hast so stets einen Überblick über eure Interaktionen.
          <br /><br />Der Chatbot gibt dir zudem Tipps für die Kontaktaufnahme
          und schlägt dir mögliche Nachrichten an deine Friends vor. Er kann dir
          auch aktuelle Events in deiner Umgebung anzeigen, die ihren Interessen
          entsprechen. <br /><br />Lade deine Friends und Bekannten ein die App
          ebenfalls zu nutzen. So bleibt ihr in Kontakt!
          <FontAwesomeIcon icon="fa-regular fa-face-smile-wink" class="px-1" />
          <br />
        </p>
        <h3 class="text-lg font-bold mb-4">
          App zum Homescreen hinzufügen:
        </h3>
        <p>
          <strong>iOS:</strong> Tippe im Safari Browser unten auf
          <FontAwesomeIcon
            icon="fa-solid fa-arrow-up-from-bracket"
            class="px-1"
          />
          Teilen und dann auf
          <FontAwesomeIcon icon="fa-regular fa-square-plus" class="px-1" />
          "Zum Home-Bildschirm".
        </p>
        <br />
        <p>
          <strong>Android:</strong> Tippe auf das
          <FontAwesomeIcon icon="fa-solid fa-ellipsis-vertical" class="px-1" />
          Menü-Symbol oben rechts und dann auf "Zum Home-Bildschirm".
        </p>
        <br />
        <p>(C) 2025 Jakob Grosse - <a href="https://github.com/j-grosse/vue-contact-management-app" target="_blank" rel="noopener noreferrer"><u>Code auf GitHub</u></a></p>
        <div class="flex justify-end gap-3">
          <button
            @click="closeModal()"
            class="btn-variant"
          >
            <FontAwesomeIcon icon="fa-check" />
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

const visible = ref(true);

function closeModal() {
  visible.value = false;
  localStorage.setItem('splashScreenShown', 'true');
  document.body.classList.remove('modal-open');
}

onMounted(() => {
  document.body.classList.add('modal-open');
});

onBeforeUnmount(() => {
  document.body.classList.remove('modal-open');
});
</script>

<style scoped></style>
