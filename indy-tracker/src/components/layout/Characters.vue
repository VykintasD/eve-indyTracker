<template>
  <v-container>
    <h1>Contact</h1>
    <p>Contact us at example@example.com.</p>
  </v-container>
</template>

<script>
  //   import axios from 'axios';

  import { apiService } from '@/services/apiController.ts';
  export default {
    name: 'Characters',
    data() {
      return {
        user: null, // Store the fetched user data
        loading: false, // Track loading state
        error: null, // Track error state
      };
    },
    async created() {
      await this.fetchCharacters();
    },
    methods: {
      async fetchCharacters() {
        this.loading = true;
        this.error = null;

        try {
          const response = apiService.fetchCharacters();
          console.log(response);

          //   console.log(data);
        } catch (error) {
          this.error = error.message; // Handle errors
        } finally {
          this.loading = false; // Reset loading state
        }
      },
    },
  };
</script>
