<template>
  <v-text-field
    placeholder="enter key light address, without scheme (e.g. 192.169.1.100)"
    :model-value="options.keyLightAddress"
    @change="$emit('updateOptions', 'keyLightAddress', $event.target.value)"
  />
  <v-text-field
    placeholder="enter key light port (not required) (e.g. 9123)"
    :model-value="options.keyLightPort"
    @change="$emit('updateOptions', 'keyLightPort', $event.target.value)"
  />
  <v-combobox
    :items="handlers"
    :model-value="options.keyLightAction"
    @update:model-value="onUpdateAction"
  />
</template>

<script>
export default {
  name: "KeyLightHandler",
  props: {
    options: {
      type: Object,
      default: null,
    },
  },
  emits: {
    updateOptions: null,
  },
  data: () => ({
    handlers: [
      { value: "toggle", title: "toggle" },
      { value: "temperature+", title: "temperature+" },
      { value: "temperature-", title: "temperature-" },
      { value: "brightness+", title: "brightness+" },
      { value: "brightness-", title: "brightness-" },
    ],
  }),
  methods: {
    onUpdateAction(newType) {
      this.$emit("updateOptions", "keyLightAction", newType);
    },
  },
};
</script>

<style scoped></style>
