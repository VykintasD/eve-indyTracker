<script>
import { apiService } from '@/services/apiController.ts'
export default {
  name: 'Characters',
  data() {
    return {
      characters: [],
    }
  },
  created() {
    this.$watch(() => {}, this.fetchCharacters, { immediate: true })
  },
  methods: {
    async fetchCharacters() {
      try {
        this.characters = await apiService.fetchCharacters()
      } catch (error) {
        this.error = error.message
      } finally {
        this.loading = false
      }
    },
    async addCharacter() {
      await apiService.addCharacter()
    },
  },
}
</script>
<template>
  <li v-for="char in characters">
    {{ char.name }}
  </li>
  <v-Btn @click="addCharacter">Add Character</v-Btn>
</template>
