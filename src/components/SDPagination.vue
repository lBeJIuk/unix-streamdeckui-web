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
      @dragenter="onDragEnter($event)"
    />

    <v-btn
      icon="mdi-card-plus-outline"
      color="primary"
      size="small"
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
    onDndPageChange: null,
  },
  methods: {
    updateActivePage(activePage) {
      this.$emit("update:activePage", activePage);
    },
    onDragEnter(event) {
      for (let i = 0; i < event.path.length; i++) {
        if (event.path[i]?.classList?.contains("v-pagination__item")) {
          this.$emit(
            "onDndPageChange",
            parseInt(event.path[i].dataset.page, 10)
          );
          break;
        }
      }
      event.path;
    },
  },
};
</script>

<style scoped></style>
