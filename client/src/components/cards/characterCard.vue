<script setup lang="ts">
const props = defineProps({
  character: Object,
});
</script>
<template>
  <div class="p-4 border rounded shadow">
    <img :src="props.character?.portrait_url" />
    {{ props.character?.name }}
  </div>
</template>
