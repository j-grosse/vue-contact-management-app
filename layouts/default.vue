<template>
  <div class="container mx-auto px-4 py-4">
    <!-- Header -->
    <AppHeader />

    <!-- Main Content -->
    <main>
      <slot />
    </main>

    <!-- Footer -->
    <!-- <footer class="bg-gray-800 text-gray-300 p-4 text-center">
      © {{ new Date().getFullYear() }} FriendCare. All rights reserved.
    </footer> -->
  </div>
</template>
