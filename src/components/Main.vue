<template>
  <DeviceSelector v-model="device" :devices="devices" />
  <ProfileSelector
    v-model="profile"
    :profiles="profiles"
    @on-profile-add="onProfileAdd"
  />
  <ButtonList
    :buttons="buttons"
    @on-button-click="onDeckButtonClick"
    @on-drag-start="onDragStart"
    @on-drag-enter="onDragEnter"
    @on-drag-end="onDragEnd"
  />
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
    draggedButton: null,
    ws: null,
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
    this.ws = new WebSocket("ws://192.168.1.100:8080");
    this.ws.onopen = () => {
      this.ws.send(JSON.stringify(wsMessages.getConfig));
    };
    this.ws.onmessage = (event) => {
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

    this.ws.onclose = function () {
      console.log("closed");
      // todo - show notice that connection is lost
    };
    this.ws.onerror = function () {
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
    onDragStart(event, index, button) {
      this.draggedButton = button;
    },
    getPathInfo(config) {
      for (let deviceIndex = 0; deviceIndex < config.length; deviceIndex++) {
        if (this.deviceID === config[deviceIndex].serial) {
          for (
            let profileIndex = 0;
            profileIndex < config[deviceIndex].profiles.length;
            profileIndex++
          ) {
            if (
              this.profileID === config[deviceIndex].profiles[profileIndex].name
            ) {
              for (
                let pageIndex = 0;
                pageIndex <
                config[deviceIndex].profiles[profileIndex].pages.length;
                pageIndex++
              ) {
                if (this.page === pageIndex) {
                  return {
                    deviceIndex: deviceIndex,
                    profileIndex: profileIndex,
                    pageIndex: pageIndex,
                    buttons: [
                      ...config[deviceIndex].profiles[profileIndex].pages[
                        pageIndex
                      ],
                    ],
                  };
                }
              }
            }
          }
        }
      }
      return false;
    },
    onDragEnter(event, hoveredButtonIndex) {
      if (this.draggedButton.index !== hoveredButtonIndex) {
        const tmpConfigs = [...this.configs];
        const pathInfo = this.getPathInfo(tmpConfigs);
        if (pathInfo) {
          pathInfo.buttons.splice(this.draggedButton.index, 1);
          pathInfo.buttons.splice(hoveredButtonIndex, 0, this.draggedButton);
          this.draggedButton.index = hoveredButtonIndex;
          tmpConfigs[pathInfo.deviceIndex].profiles[
            pathInfo.profileIndex
          ].pages[pathInfo.pageIndex] = pathInfo.buttons;
          this.configs = tmpConfigs;
        }
      }
    },
    onDragEnd() {
      this.saveConfig();
    },
    saveConfig() {
      const msg = { ...wsMessages.setConfig };
      msg.data = JSON.stringify({
        decks: this.configs,
      });
      // this.ws.send(JSON.stringify(msg));
    },
  },
};
</script>
