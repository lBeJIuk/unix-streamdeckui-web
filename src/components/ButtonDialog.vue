<template>
  <v-dialog :model-value="opened" @click:outside="closeDialog">
    <v-card>
      <div v-if="button.options.icon" class="image-container">
        <v-img :src="button.options.icon" height="200" />
        <v-btn icon>
          <v-icon @click="onImageDeleteClick">mdi-delete</v-icon>
        </v-btn>
      </div>
      <v-img
        v-if="!button.options.icon && button.options.backgroundColor"
        :style="{
          backgroundImage: `linear-gradient(0, ${button.options.backgroundColor}, ${button.options.backgroundColor})`,
        }"
        height="200"
      />

      <v-file-input truncate-length="15" @change="selectFile"></v-file-input>
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
    selectFile(event) {
      const reader = new FileReader();
      reader.readAsDataURL(event.target.files[0]);
      reader.onload = () => {
        this.updateButton("icon", reader.result);
      };
    },
    onDeleteClick() {
      this.$emit("onUpdate", getDummyButton(this.button.buttonIndex));
      this.closeDialog();
    },
    onImageDeleteClick() {
      this.updateButton("icon", "");
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

<style scoped>
.image-container {
  position: relative;
}
.image-container > button {
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translate(-50%);
}
</style>
