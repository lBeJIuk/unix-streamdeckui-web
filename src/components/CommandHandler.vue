<template>
  <input
    placeholder="enter command"
    :value="options.command"
    @change="$emit('updateOptions', 'command', $event.target.value)"
  />
</template>

<script>
export default {
  name: "CommandHandler",
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
