<template>
  <v-container
    style="display: flex; justify-content: center; align-items: center"
  >
    <v-pagination
      :model-value="activePage"
      :length="pages"
      start="0"
      size="x-small"
      rounded="circle"
      color="primary"
      style="width: 300px"
      @update:model-value="updateActivePage"
    />

    <v-btn
      icon="mdi-card-plus-outline"
      color="primary"
      size="x-small"
      @click="$emit('onPageAdd')"
    />
  </v-container>
</template>

<script>
export default {
  name: "SDPagination",
  props: {
    pages: {
      type: Number,
      default: 0,
    },
    activePage: {
      type: Number,
      default: 0,
    },
  },
  emits: {
    onPageAdd: null,
    "update:activePage": null,
  },
  methods: {
    updateActivePage(activePage) {
      this.$emit("update:activePage", activePage);
    },
  },
};
</script>

<style scoped></style>
