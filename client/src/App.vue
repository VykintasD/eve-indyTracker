<script setup>
import Sidebar from './components/layout/sidebar.vue'
</script>
<template>
  <v-app>
    <v-app-bar title="EVE Tracker"></v-app-bar>
    <Sidebar />
    <v-main>
      <router-view></router-view>
    </v-main>
  </v-app>
</template>
