<script setup>
  function startAuth() {
    window.location.href = 'https://localhost:5000/auth';
  }
</script>
<template>
  <div>
    <h1>Welcome to the Vue App</h1>
    <button @click="startAuth">Start OAuth Flow</button>
    <button @click="fetchData">Fetch Data</button>
    <div v-if="data">
      <h2>Data from API:</h2>
      <pre>{{ data }}</pre>
    </div>
  </div>
</template>
