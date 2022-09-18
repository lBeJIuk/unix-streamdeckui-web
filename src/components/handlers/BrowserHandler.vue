<template>
  <v-text-field
    placeholder="enter URL"
    :model-value="options.url"
    @change="$emit('updateOptions', 'url', $event.target.value)"
  />
</template>

<script>
export default {
  name: "BrowserHandler",
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
