<template>
  <input
    placeholder="enter page number"
    :value="options.page"
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
