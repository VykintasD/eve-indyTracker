<script setup>
  import { ref } from 'vue';
  const data = ref(null);
  const wallet = ref(null);

  function startAuth() {
    window.location.href = 'https://localhost:5000/auth';
  }

  async function fetchCharacters() {
    try {
      const response = await fetch('https://localhost:5000/api/characters');
      console.log(response);
      data.value = await response.json();
      console.log(data);
    } catch (err) {
      console.log(err);
    }
  }

  async function fetchWalletBalance() {
    try {
      const charId = data.value[0].id;
      console.log(charId);
      const response = await fetch(
        `https://localhost:5000/esi/characters/${charId}/wallet`
      );
      console.log(response);
      wallet.value = await response.json();
      console.log(data);
    } catch (err) {
      console.log(err);
    }
  }
</script>
<template>
  <div>
    <h1>Welcome to the Vue App</h1>
    <button @click="startAuth">Start OAuth Flow</button>
    <button @click="fetchCharacters">Get Characters</button>
    <button @click="fetchWalletBalance">Get Wallet Balance</button>
    <div v-if="data">
      <h2>Authenticated Characters:</h2>
      <pre>{{ data }}</pre>
    </div>
    <div v-if="wallet">
      <h2>Wallets:</h2>
      <pre>{{ wallet }}</pre>
    </div>
  </div>
</template>
