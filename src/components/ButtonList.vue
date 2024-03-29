<template>
  <v-container
    class="buttonList"
    :style="{
      gridTemplateColumns: `repeat(${columns}, 75px)`,
    }"
    @dragenter.prevent
  >
    <v-container
      v-for="(button, index) in buttons"
      :key="button.value"
      class="button button--dragable"
      draggable="true"
      :data-index="index"
      @click="$emit('onButtonClick', $event, index, button)"
      @dragstart="onDragStart($event, index, button)"
      @dragenter="onDragEnter($event, index, button)"
      @dragend="onDragEnd($event, index, button)"
    >
      <img
        v-if="button?.options?.icon"
        :src="button.options.icon"
        width="50"
        height="50"
      />
      <img
        v-else-if="button?.options?.backgroundColor"
        width="50"
        height="50"
        :style="{ backgroundColor: `${button.options.backgroundColor}` }"
      />
      <span
        :style="{ color: `${button?.options?.textColor}`, fontSize: '10px' }"
        >{{ button?.options?.text }}</span
      >
    </v-container>
  </v-container>
</template>

<style scoped>
.buttonList {
  display: grid;
  justify-content: space-around;
  grid-auto-rows: 50px;
  gap: 45px;
}
.button {
  cursor: pointer;
  width: 75px;
  height: 75px;
  border: 1px solid black;
  position: relative;
  padding: 12px;
}

.button > span {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  font-size: 12px;
}
</style>

<script>
export default {
  name: "ButtonList",
  components: {},
  props: {
    buttons: {
      type: Array,
      default: () => [],
    },
  },
  emits: {
    onButtonClick: null,
    onDragStart: null,
    onDragEnd: null,
    onDragEnter: null,
  },
  computed: {
    columns() {
      let cols = 0;
      switch (this.buttons.length) {
        case 6:
          cols = 3;
          break;
        case 15:
          cols = 5;
          break;
        case 32:
          cols = 8;
          break;
      }
      return cols;
    },
  },
  methods: {
    onDragStart(event, index, button) {
      this.$emit("onDragStart", event, index, button);
    },
    onDragEnter(event, index, button) {
      this.$emit("onDragEnter", event, index, button);
    },
    onDragEnd(event, index, button) {
      this.$emit("onDragEnd", event, index, button);
    },
  },
};
</script>
