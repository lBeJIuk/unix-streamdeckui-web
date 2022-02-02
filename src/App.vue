<template>
  <v-app>
    <v-main
      :style="{
        backgroundImage: `url(${bg})`,
        backgroundSize: '100% 100%',
        backgroundRepeat: 'no-repeat',
      }"
    >
      <Main />
    </v-main>
  </v-app>
</template>

<script>
import Main from "./components/Main.vue";
import bg from "./assets/bg.jpg";

export default {
  name: "App",

  components: {
    Main,
  },
  data: () => ({
    bg,
  }),
};
</script>
