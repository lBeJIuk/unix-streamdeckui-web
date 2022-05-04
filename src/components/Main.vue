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
    class="SDPagination"
    @on-page-add="onPageAdd"
  />
  <ButtonDialog
    v-model="buttonDialogShowed"
    :button-config="selectedButtonConfig"
  />
</template>

<style scoped>
.SDPagination {
  margin-top: 40px;
}
</style>

<script>
import bg from "../assets/bg.jpg";
import ButtonList from "./ButtonList.vue";
import SDPagination from "./SDPagination.vue";
import ProfileSelector from "./ProfileSelector.vue";
import DeviceSelector from "./DeviceSelector.vue";
import ButtonDialog from "./ButtonDialog.vue";
import { wsMessages } from "../utils";

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
    configs: [],
    deviceID: "",
    profileID: "",
    page: 0,
    bg,
    buttonDialogShowed: false,
    selectedButton: null,
  }),
  computed: {
    devices() {
      const devices = this.configs.map((device) => ({
        value: device.serial,
        text: device.serial,
      }));
      return devices ?? [];
    },
    device() {
      const device = this.configs.find(
        (device) => device.serial === this.deviceID
      );
      return device ?? { profiles: [] };
    },
    profiles() {
      const profiles = this.device.profiles.map((profile) => ({
        value: profile.name,
        text: profile.name,
      }));
      return profiles ?? [];
    },
    profile() {
      const profile = this.device.profiles.find(
        (profile) => profile.name === this.profileID
      );
      return profile ?? { pages: [] };
    },
    pages() {
      return this.profile.pages;
    },
    buttons() {
      const buttons = this.pages[this.page];
      return buttons ?? [];
    },
    selectedButtonConfig() {
      const selectedButtonConfig = this.buttons[this.selectedButton];
      return selectedButtonConfig ?? {};
    },
  },
  watch: {
    device() {
      this.profileID = this.profile.name;
    },
    profile() {
      this.page = 0;
    },
  },
  beforeMount: function () {
    const ws = new WebSocket("ws://192.168.1.100:8080");
    ws.onopen = function () {
      ws.send(JSON.stringify(wsMessages.getConfig));
    };
    ws.onmessage = (event) => {
      const response = JSON.parse(event.data);
      switch (response.type) {
        case wsMessages.getConfig.type:
          this.configs = JSON.parse(response.data).decks.filter((deck) => {
            if (deck.serial !== "") {
              if (this.deviceID === "") {
                this.deviceID = deck.serial;
                this.profileID = deck.profiles[0].name;
              }
              return true;
            }
          });
          break;
      }
    };

    ws.onclose = function () {
      console.log("closed");
      // todo - show notice that connection is lost
    };
    ws.onerror = function () {
      console.log("err");
      // todo - show notice that connection is lost
    };
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
