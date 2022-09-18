<template>
  <v-dialog
    :model-value="opened"
    min-width="400"
    class="ButtonDialog"
    @click:outside="closeDialog"
  >
    <v-card class="DialogCard">
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
      <v-card-text> Extra configs </v-card-text>
      <v-combobox
        :items="handlers"
        :model-value="button.type"
        @update:model-value="onTypeUpdate"
      ></v-combobox>
      <CommandHandler
        v-if="button.type === 'command'"
        :options="button.options"
        @update-options="updateOption"
      />
      <BrowserHandler
        v-if="button.type === 'browser'"
        :options="button.options"
        @update-options="updateOption"
      />
      <ChangePageHandler
        v-if="button.type === 'changePage'"
        :options="button.options"
        @update-options="updateOption"
      />
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
import { getDefaultButton, getDummyButton } from "../utils";
import CommandHandler from "./handlers/CommandHandler.vue";
import BrowserHandler from "./handlers/BrowserHandler.vue";
import ChangePageHandler from "./handlers/ChangePageHandler.vue";

export default {
  name: "ButtonDialog",
  components: {
    CommandHandler,
    BrowserHandler,
    ChangePageHandler,
  },
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
  data: () => ({
    handlers: [
      { value: "command", title: "command" },
      { value: "browser", title: "browser" },
      { value: "changePage", title: "changePage" },
    ],
  }),
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
    onTypeUpdate(newType) {
      const button = getDefaultButton(this.button);
      button.type = newType;
      this.$emit("onUpdate", button);
    },
    updateOption(option, value) {
      this.updateButton(option, value);
    },
  },
};
</script>

<style scoped>
.ButtonDialog .DialogCard {
  width: 50vw;
}
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
