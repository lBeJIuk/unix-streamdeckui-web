<template>
  <v-container
    class="buttonList"
    :style="{
      gridTemplateColumns: `repeat(${columns}, 50px)`,
    }"
  >
    <v-container
      v-for="button in buttons"
      :key="button.value"
      class="button"
      @click="$emit('onButtonClick', $event, button)"
    />
  </v-container>
</template>

<style scoped>
.buttonList {
  display: grid;
  justify-content: space-around;
  grid-auto-rows: 50px;
  gap: 10px;
}
.button {
  background-color: black;
}
</style>

<script>
export default {
  name: "ButtonList",
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
