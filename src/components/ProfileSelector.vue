<template>
  <v-container>
    <label for="profiles">Choose a profile:</label>
    <select
      id="profiles"
      name="profiles"
      @change="$emit('update:modelValue', $event.target.value)"
    >
      <option
        v-for="profilesOptions in profiles"
        :key="profilesOptions.value"
        :value="profilesOptions.value"
        :selected="modelValue === profilesOptions.value"
      >
        {{ profilesOptions.text }}
      </option>
    </select>
    <v-btn
      icon="mdi-file-plus-outline"
      color="primary"
      size="x-small"
      @click="$emit('onProfileAdd')"
    />
  </v-container>
</template>

<script>
export default {
  name: "ProfileSelector",
  props: {
    modelValue: {
      type: String,
      default: "",
    },
    profiles: {
      type: Array,
      default: () => [],
    },
  },
  emits: {
    "update:modelValue": null,
    onProfileAdd: null,
  },
};
</script>

<style scoped></style>
