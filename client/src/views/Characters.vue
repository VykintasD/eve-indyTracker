<template>
  <v-container>
    <v-list>
      <v-list-item v-for="(item, i) in items" :key="i" :value="item" color="primary">
        <template v-slot:prepend>
          <v-icon :icon="item.icon"></v-icon>
        </template>

        <v-list-item-title v-text="item.text"></v-list-item-title>
      </v-list-item>
    </v-list>
  </v-container>
</template>

<script>
//   import axios from 'axios';

import { apiService } from '@/services/apiController.ts'
export default {
  name: 'Characters',
  data: () => {
    items: null
  },
  async created() {
    await this.fetchCharacters()
  },
  methods: {
    async fetchCharacters() {
      this.loading = true
      this.error = null

      try {
        const response = await apiService.fetchCharacters()
        items = response
        console.log(response)

        console.log(data)
      } catch (error) {
        this.error = error.message // Handle errors
      } finally {
        this.loading = false // Reset loading state
      }
    },
  },
}
</script>
