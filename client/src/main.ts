import { createApp } from 'vue';

// Vuetify
import 'vuetify/styles';
import { createVuetify } from 'vuetify';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';

// Icons
import { aliases, mdi } from 'vuetify/iconsets/mdi';
import '@mdi/font/css/materialdesignicons.css';

// Router
import router from './router';

const icons = {
  defaultSet: 'mdi',
  aliases,
  sets: {
    mdi,
  },
};

// Components
import App from './App.vue';
import { createPinia } from 'pinia';

const vuetify = createVuetify({
  components,
  directives,
  theme: {
    defaultTheme: 'dark',
  },
  icons,
});

createApp(App).use(vuetify).use(router).use(createPinia()).mount('#app');
