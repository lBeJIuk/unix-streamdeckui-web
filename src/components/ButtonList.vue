<template>
  <v-container
    class="buttonList"
    :style="{
      gridTemplateColumns: `repeat(${columns}, 75px)`,
    }"
  >
    <v-container
      v-for="button in buttons"
      :key="button.value"
      class="button"
      @click="$emit('onButtonClick', $event, button)"
    >
      <img v-if="button.icon" :src="button.icon" width="50" height="50" />
      <span>{{ button.text }}</span>
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
  width: 75px;
  height: 75px;
  border: 1px solid black;
  position: relative;
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
};
</script>
