<script setup>
import characterCard from '@/components/cards/characterCard.vue';
import { apiService } from '@/services/apiController.ts';
import { ref, reactive } from 'vue';

const characters = ref(null);

const fetchCharacters = async () => {
  try {
    characters.value = await apiService.fetchCharacters();
  } catch (err) {
    console.error(err);
  }
};

const addCharacter = async () => {
  await apiService.addCharacter();
};

fetchCharacters();
</script>
<template>
  <characterCard v-for="char in characters" :character="char" />
  <v-Btn @click="addCharacter">Add Character</v-Btn>
</template>
