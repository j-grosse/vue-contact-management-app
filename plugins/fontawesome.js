// import { defineNuxtPlugin } from '#app'
import { library, config } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { fas } from '@fortawesome/free-solid-svg-icons'
import {
  faSquarePlus, faFaceSmileWink
 } from '@fortawesome/free-regular-svg-icons'
/*
import {
  faHouse,
  faCog,
  faTh,
  faList,
  faUsers,
  faPlus,
  faChevronUp,
  faChevronDown,
  faPaperPlane,
  faSearch,
  faCheck,
  faImage,
  faTrash,
  faUser,
  faFloppyDisk,
  faFileImport,
  faMoon,
  faSun,
} from '@fortawesome/free-solid-svg-icons'
 import {

// Add the icons you want
library.add(
  faHouse,
  faCog,
  faTh,
  faList,
  faUsers,
  faPlus,
  faChevronUp,
  faChevronDown,
  faPaperPlane,
  faSearch,
  faCheck,
  faImage,
  faTrash,
  faUser,
  faFloppyDisk,
  faFileImport,
  faMoon,
  faSun
)
*/
library.add(fas, faSquarePlus, faFaceSmileWink)

// This is important, we are going to let Nuxt worry about the CSS
config.autoAddCss = false

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.component('FontAwesomeIcon', FontAwesomeIcon, {})
})