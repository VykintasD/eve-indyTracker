<script>
  export default {
    data: () => ({
      items: [
        {
          text: 'Home',
          icon: 'mdi-home-variant',
          path: '/',
        },
        {
          text: 'Shared with me',
          icon: 'mdi-account-multiple',
          path: '/characters',
        },
      ],
    }),
  };
</script>
<template>
  <v-navigation-drawer rail>
    <v-list :lines="false" density="compact" nav>
      <v-list-item
        v-for="(item, i) in items"
        :key="i"
        :value="item"
        :to="item.path"
        color="primary"
      >
        <template v-slot:prepend>
          <v-icon :icon="item.icon"></v-icon>
        </template>

        <v-list-item-title v-text="item.text"></v-list-item-title>
      </v-list-item>
    </v-list>
  </v-navigation-drawer>
</template>
