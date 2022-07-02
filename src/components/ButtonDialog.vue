<template>
  <v-dialog :model-value="opened" @click:outside="closeDialog">
    <v-card>
      <v-img
        v-if="button.options.icon"
        :src="button.options.icon"
        height="200"
      />
      <v-img
        v-if="!button.options.icon && button.options.backgroundColor"
        :style="{
          backgroundImage: `linear-gradient(0, ${button.options.backgroundColor}, ${button.options.backgroundColor})`,
        }"
        height="200"
      />
      <v-card-subtitle> Configurations </v-card-subtitle>
      <v-form>
        <v-text-field
          :model-value="button.options.backgroundColor"
          label="Background color"
          hide-details="auto"
          placeholder="Color of the Background"
          @input="updateButton('backgroundColor', $event.target.value)"
        />
        <v-text-field
          :model-value="button.options.text"
          label="Text"
          hide-details="auto"
          placeholder="Text over the icon"
          @input="updateButton('text', $event.target.value)"
        />
        <v-text-field
          :model-value="button.options.textColor"
          label="Text color"
          hide-details="auto"
          placeholder="Color of the text"
          @input="updateButton('textColor', $event.target.value)"
        />
      </v-form>

      <v-card-text>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
        tempor incididunt ut labore et dolore magna aliqua.
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn icon>
          <v-icon @click="onDeleteClick">mdi-delete</v-icon>
        </v-btn>
        <v-spacer></v-spacer>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { getDummyButton } from "./utils";

export default {
  name: "ButtonDialog",
  props: {
    opened: {
      type: Boolean,
      default: false,
    },
    button: {
      type: Object,
      default: () => ({}),
    },
  },
  emits: {
    "update:opened": null,
    onUpdate: null,
  },
  methods: {
    onDeleteClick() {
      this.$emit("onUpdate", getDummyButton(this.button.buttonIndex));
      this.closeDialog();
    },
    closeDialog() {
      this.$emit("update:opened", !this.opened);
    },
    updateButton(prop, value) {
      const button = { ...this.button };
      button.options[prop] = value;
      this.$emit("onUpdate", button);
    },
  },
};
</script>

<style scoped></style>
