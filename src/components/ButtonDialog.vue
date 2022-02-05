<template>
  <v-dialog
    :model-value="modelValue"
    @click:outside="$emit('update:modelValue', !modelValue)"
  >
    <v-card>
      <v-card-text>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
        tempor incididunt ut labore et dolore magna aliqua.
      </v-card-text>
      <v-card-actions>
        <v-btn
          color="primary"
          block
          @click="$emit('update:modelValue', !modelValue)"
          >Close Dialog</v-btn
        >
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: "ButtonDialog",
  props: {
    modelValue: {
      type: Boolean,
      default: false,
    },
  },
  emits: {
    "update:modelValue": null,
  },
};
</script>

<style scoped></style>
