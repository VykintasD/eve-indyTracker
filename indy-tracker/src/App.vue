<script setup>
  //import axios from 'axios';

  function startAuth() {
    window.location.href = 'http://localhost:5000/auth';
  }

  // export default {
  //   data() {
  //     return {
  //       data: null,
  //     };
  //   },
  //   methods: {
  //     startAuth() {
  //       window.location.href = 'http://localhost:3000/auth';  // Redirects to backend OAuth flow
  //     },
  //     async fetchData() {
  //       try {
  //         const response = await axios.get('http://localhost:3000/data');
  //         this.data = response.data;
  //       } catch (error) {
  //         console.error('Error fetching data:', error);
  //       }
  //     },
  //   },
  // };
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
