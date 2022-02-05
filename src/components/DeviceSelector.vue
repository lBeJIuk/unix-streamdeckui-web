<template>
  <v-container>
    <label for="devices">Choose a device:</label>
    <select
      id="devices"
      name="devices"
      @change="$emit('update:modelValue', $event.target.value)"
    >
      <option
        v-for="deviceOption in devices"
        :key="deviceOption.value"
        :value="deviceOption.value"
        :selected="modelValue === deviceOption.value"
      >
        {{ deviceOption.text }}
      </option>
    </select>
  </v-container>
</template>

<script>
export default {
  name: "DeviceSelector",
  props: {
    devices: {
      type: Array,
      default: () => [],
    },
    modelValue: {
      type: String,
      default: "",
    },
  },
  emits: {
    "update:modelValue": null,
  },
};
</script>

<style scoped></style>
