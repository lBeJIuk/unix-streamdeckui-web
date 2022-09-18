<template>
  <v-text-field
    placeholder="enter page number"
    :model-value="options.page"
    @change="$emit('updateOptions', 'page', parseInt($event.target.value, 10))"
  />
</template>

<script>
export default {
  name: "ChangePageHandler",
  props: {
    options: {
      type: Object,
      default: null,
    },
  },
  emits: {
    updateOptions: null,
  },
};
</script>

<style scoped></style>
