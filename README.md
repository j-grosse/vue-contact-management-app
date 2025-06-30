# FriendCare App

A Progressive Web App made with Vue 3 / Nuxt 3 and Tailwind CSS.  
Never forget to keep in contact with your friends on a regular basis.  
Set a an individual contact period for each of your friends and the app 
shows you the friends to cantact next on top.     
Track your interactions and see them in your global interactions history.
The AI Chatbot recommends message suggestions and events that fit your 
friends interests.  

- Progressive Web App (PWA) with persistent data saved to local storage
- Import and export of all data via local storage (JSON backup/restore)
- Light and dark mode support
- Grid view and table view for displaying friends
- Profile image upload (converted to Base64, stored locally)
- Add, edit, and delete friends with and add notes about their interests
- Set individual contact intervals per friend
- Friends that need to be contacted soon automatically move up
- Friends marked as contacted move further down the queue
- Automatic reminders for upcoming contacts based on interval
- Add, edit, and delete interaction notes for each friend
- Global interactions history
- AI Chatbot (Google Gemini 2.0 Flash Lite LLM) for:
  - Message suggestions tailored to each friend
  - Conversation tips and ideas
  - Event recommendations based on friend interests
- Responsive design for mobile and desktop
- Add app to homescreen instructions for iOS and Android
- Splash screen

![FriendCare v1.0.0](https://github.com/user-attachments/assets/a71c4b19-c644-4a37-b130-40a836f94e10)

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
