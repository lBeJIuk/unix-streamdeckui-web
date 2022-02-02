<template>
  <v-container>
    <label for="devices">Choose a device:</label>
    <select id="devices" name="devices">
      <option
        v-for="deviceOption in devices"
        :key="deviceOption.value"
        :value="deviceOption.value"
      >
        {{ deviceOption.text }}
      </option>
    </select>
  </v-container>

  <v-container>
    <label for="profiles">Choose a profile:</label>
    <select id="profiles" name="profiles">
      <option
        v-for="profilesOptions in profiles"
        :key="profilesOptions.value"
        :value="profilesOptions.value"
      >
        {{ profilesOptions.text }}
      </option>
    </select>
  </v-container>

  <v-container
    style="display: grid; grid-template-columns: repeat(5, 1fr); gap: 10px"
  >
    <v-container
      v-for="button in buttons"
      :key="button.value"
      class="grey lighten-5"
      :style="{
        width: '100px',
        height: '100px',
        backgroundColor: 'black',
        marginBottom: '10px',
      }"
    >
    </v-container>
  </v-container>
</template>

<script>
import bg from "../assets/bg.jpg";

export default {
  name: "HelloWorld",

  data: () => ({
    configs: {
      fake_id: {
        fake_profile: [
          [{}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}],
        ],
      },
      fake_id_2: {
        fake_profile_2: [
          [{}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}],
        ],
      },
    },
    device: "fake_id",
    profile: "fake_profile",
    page: 0,
    bg,
  }),
  computed: {
    buttons() {
      return this.configs[this.device][this.profile][this.page];
    },
    devices() {
      return Object.keys(this.configs).map((device) => ({
        value: device,
        text: device,
      }));
    },
    profiles() {
      return Object.keys(this.configs[this.device]).map((profile) => ({
        value: profile,
        text: profile,
      }));
    },
    pages() {
      return this.configs[this.device][this.profile].length;
    },
  },
};
</script>
