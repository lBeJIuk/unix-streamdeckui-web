<template>
  <DeviceSelector v-model="device" :devices="devices" />
  <ProfileSelector
    v-model="profile"
    :profiles="profiles"
    @on-profile-add="onProfileAdd"
  />
  <ButtonList :buttons="buttons" @on-button-click="onDeckButtonClick" />
  <SDPagination
    v-model:active-page="page"
    :pages="pages.length"
    @on-page-add="onPageAdd"
  />
  <ButtonDialog
    v-model="buttonDialogShowed"
    :button-config="selectedButtonConfig"
  />
</template>

<style scoped></style>

<script>
import bg from "../assets/bg.jpg";
import ButtonList from "./ButtonList.vue";
import SDPagination from "./SDPagination.vue";
import ProfileSelector from "./ProfileSelector.vue";
import DeviceSelector from "./DeviceSelector.vue";
import ButtonDialog from "./ButtonDialog.vue";

export default {
  name: "UnixStreamDeckWeb",
  components: {
    ButtonList,
    SDPagination,
    ProfileSelector,
    DeviceSelector,
    ButtonDialog,
  },
  data: () => ({
    configs: {
      fake_id: {
        fake_profile: [
          // // xl
          // [
          //   {},
          //   {},
          //   {},
          //   {},
          //   {},
          //   {},
          //   {},
          //   {},
          //   {},
          //   {},
          //   {},
          //   {},
          //   {},
          //   {},
          //   {},
          //   {},
          //   {},
          //   {},
          //   {},
          //   {},
          //   {},
          //   {},
          //   {},
          //   {},
          //   {},
          //   {},
          //   {},
          //   {},
          //   {},
          //   {},
          //   {},
          //   {},
          // ],
          // normal
          [{}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}],
          [{}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}],
          [{}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}],
        ],
        fake_profile_2: [
          // // xl
          // [
          //   {},
          //   {},
          //   {},
          //   {},
          //   {},
          //   {},
          //   {},
          //   {},
          //   {},
          //   {},
          //   {},
          //   {},
          //   {},
          //   {},
          //   {},
          //   {},
          //   {},
          //   {},
          //   {},
          //   {},
          //   {},
          //   {},
          //   {},
          //   {},
          //   {},
          //   {},
          //   {},
          //   {},
          //   {},
          //   {},
          //   {},
          //   {},
          // ],
          // normal
          [{}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}],
          [{}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}],
        ],
      },
      fake_id_2: {
        fake_profile_2: [
          // // xl
          // [
          //   {},
          //   {},
          //   {},
          //   {},
          //   {},
          //   {},
          //   {},
          //   {},
          //   {},
          //   {},
          //   {},
          //   {},
          //   {},
          //   {},
          //   {},
          //   {},
          //   {},
          //   {},
          //   {},
          //   {},
          //   {},
          //   {},
          //   {},
          //   {},
          //   {},
          //   {},
          //   {},
          //   {},
          //   {},
          //   {},
          //   {},
          //   {},
          // ],
          // normal
          [{}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}],
        ],
      },
    },
    device: "fake_id",
    profile: "fake_profile",
    page: 0,
    bg,
    buttonDialogShowed: false,
    selectedButton: null,
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
      return this.configs[this.device][this.profile];
    },
    selectedButtonConfig() {
      return this.buttons[this.selectedButton];
    },
  },
  watch: {
    device() {
      this.profile = Object.keys(this.configs[this.device])[0];
    },
    profile() {
      this.page = 0;
    },
  },
  methods: {
    onPageAdd() {
      this.configs[this.device][this.profile].push(
        Array.from(this.buttons, () => ({}))
      );
      this.page = this.configs[this.device][this.profile].length - 1;
    },
    onProfileAdd() {
      let baseProfileName = "new profile",
        newProfileName = baseProfileName,
        index = 0;
      while (this.configs[this.device][newProfileName]) {
        newProfileName = `${baseProfileName}(${index})`;
        index++;
      }
      this.configs[this.device][newProfileName] = [
        Array.from(this.buttons, () => ({})),
      ];
      this.profile = newProfileName;
    },
    onDeckButtonClick(e, button) {
      console.log(e, button);
      this.buttons.filter((el) => el.id === button.id);
      this.buttonDialogShowed = true;
    },
  },
};
</script>
