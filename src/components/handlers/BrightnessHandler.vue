<template>
  <v-text-field
    placeholder="Brightness"
    :model-value="options.brightness"
    @change="$emit('updateOptions', 'brightness', $event.target.value)"
  />
</template>

<script>
export default {
  name: "BrightnessHandler",
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
