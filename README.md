# FriendCare App

A Progressive Web App made with Vue 3 / Nuxt 3 and Tailwind CSS
The order of the freinds to contact next changes depending of the individually set contact period.
The Chatbot recommends topics, messages and events to visit that fit to your notes that contain of the friends interests and interactions with you.

- Chatbot (Google gemini-2.0-flash-lite LLM)
- local storage import and export
- profile photo import (coverts to 192px x 192px Base64 image)
- light and dark mode
- grid view and table view

![](./assets/screenshot1.jpg)
![](./assets/screenshot2.jpg)

## Setup

Make sure to install dependencies:

```bash
# npm
npm install
```

## Development Server

Start the development server on `http://localhost:3000`:

```bash
# npm
npm run dev
```

## Production

Build the application for production:

```bash
# npm
npm run build
```

Locally preview production build:

```bash
# npm
npm run preview
```

Look at the [Nuxt documentation](https://nuxt.com/docs/getting-started/introduction) or
check out the [deployment documentation](https://nuxt.com/docs/getting-started/deployment) for more information.
