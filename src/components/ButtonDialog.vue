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
          class="elevation-6"
          @click="$emit('update:modelValue', !modelValue)"
          >save</v-btn
        >
        <v-spacer></v-spacer>
        <v-btn icon>
          <v-icon @click="onDeleteClick">mdi-delete</v-icon>
        </v-btn>
        <v-spacer></v-spacer>
        <v-btn
          color="error"
          class="elevation-6"
          @click="$emit('update:modelValue', !modelValue)"
          >close</v-btn
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
    buttonConfig: {
      type: Object,
      default: () => ({}),
    },
  },
  emits: {
    "update:modelValue": null,
    onUpdate: null,
  },
  methods: {
    onDeleteClick() {
      this.$emit("onUpdate", {});
      this.$emit("update:modelValue", !this.modelValue);
    },
  },
};
</script>

<style scoped></style>
