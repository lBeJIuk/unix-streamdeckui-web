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
  />
  <SDPagination
    v-model:active-page="page"
    :pages="pages.length"
    class="SDPagination"
    @on-page-add="onPageAdd"
    @on-dnd-page-change="onDndPageChange"
  />
  <ButtonDialog
    v-model:opened="buttonDialogShowed"
    :button="selectedButtonConfig"
    @on-update="onButtonUpdate"
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
import { wsMessages, getDummyButton } from "../utils";

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
    selectedButtonIndex: null,
    draggedButton: null,
    ws: null,
    replaceWhileDrag: false,
    allowUpdates: false,
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
      return device ?? { serial: "", profiles: [] };
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
      return profile ?? { name: "", pages: [] };
    },
    pages() {
      return this.profile.pages;
    },
    buttons() {
      const buttons = this.pages[this.page];
      return buttons ?? [];
    },
    selectedButtonConfig() {
      const selectedButtonConfig = this.buttons[this.selectedButtonIndex];
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
    configs() {
      this.saveConfig();
    },
    page() {
      if (this.draggedButton !== null) {
        // First element on new page should be replaced.
        // Next elements should be moved.
        this.replaceWhileDrag = true;
      }
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
          this.configs = JSON.parse(response.data).decks.reduce((acc, deck) => {
            if (deck.serial !== "") {
              if (this.deviceID === "") {
                this.deviceID = deck.serial;
                this.profileID = deck.profiles[0].name;
              }
              for (
                let profileIndex = 0;
                profileIndex < deck.profiles.length;
                profileIndex++
              ) {
                for (
                  let pagesIndex = 0;
                  pagesIndex < deck.profiles[profileIndex].pages.length;
                  pagesIndex++
                ) {
                  for (
                    let buttonIndex = 0;
                    buttonIndex <
                    deck.profiles[profileIndex].pages[pagesIndex].length;
                    buttonIndex++
                  ) {
                    deck.profiles[profileIndex].pages[pagesIndex][buttonIndex] =
                      {
                        ...getDummyButton(buttonIndex),
                        ...deck.profiles[profileIndex].pages[pagesIndex][
                          buttonIndex
                        ],
                      };
                  }
                }
              }
              acc.push(deck);
              return acc;
            }
          }, []);
          setTimeout(() => (this.allowUpdates = true), 100);
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
    onDeckButtonClick(event, index) {
      this.selectedButtonIndex = index;
      this.buttonDialogShowed = true;
    },
    onDragStart(event, index, button) {
      this.draggedButton = { button, page: this.page };
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
      if (
        this.draggedButton.button.page !== this.page ||
        this.draggedButton.button.buttonIndex !== hoveredButtonIndex
      ) {
        const tmpConfigs = [...this.configs];
        const pathInfo = this.getPathInfo(tmpConfigs);
        if (pathInfo) {
          if (this.replaceWhileDrag) {
            // Page was changed
            // Buttons should be replaced
            this.draggedButton.button.buttonIndex = hoveredButtonIndex;
            pathInfo.buttons.splice(
              hoveredButtonIndex,
              1,
              this.draggedButton.button
            );
            this.replaceWhileDrag = false;
          } else {
            // Same page
            // Buttons should be moved
            pathInfo.buttons.splice(this.draggedButton.button.buttonIndex, 1);
            this.draggedButton.button.buttonIndex = hoveredButtonIndex;
            pathInfo.buttons.splice(
              hoveredButtonIndex,
              0,
              this.draggedButton.button
            );
          }
          tmpConfigs[pathInfo.deviceIndex].profiles[
            pathInfo.profileIndex
          ].pages[pathInfo.pageIndex] = pathInfo.buttons;
          this.configs = tmpConfigs;
        }
      }
    },
    saveConfig() {
      if (this.allowUpdates) {
        const msg = { ...wsMessages.setConfig };
        const config = this.changeButton(
          JSON.parse(JSON.stringify(this.configs)), // hack-clone
          ({ button }) => {
            if (
              button.type === "" &&
              Object.keys(button.options).length === 0
            ) {
              return {};
            }
            delete button.buttonIndex;
            return button;
          }
        );
        msg.data = JSON.stringify({
          decks: config,
        });
        console.log("update", config);
        this.ws.send(JSON.stringify(msg));
      }
    },
    changeButton(initialConfig, changeFunction) {
      const config = [...initialConfig];
      for (let deckIndex = 0; deckIndex < config.length; deckIndex++) {
        const deck = config[deckIndex];
        for (
          let profileIndex = 0;
          profileIndex < deck.profiles.length;
          profileIndex++
        ) {
          const profile = deck.profiles[profileIndex];
          for (
            let pagesIndex = 0;
            pagesIndex < profile.pages.length;
            pagesIndex++
          ) {
            const page = profile.pages[pagesIndex];
            for (
              let buttonIndex = 0;
              buttonIndex < page.length;
              buttonIndex++
            ) {
              const button = page[buttonIndex];
              config[deckIndex].profiles[profileIndex].pages[pagesIndex][
                buttonIndex
              ] = changeFunction({
                config,
                button,
                deckIndex,
                profileIndex,
                pagesIndex,
                buttonIndex,
              });
            }
          }
        }
      }
      return config;
    },
    onButtonUpdate(newButtonConfig) {
      const tmpConfigs = [...this.configs];
      const pathInfo = this.getPathInfo(tmpConfigs);
      if (pathInfo) {
        pathInfo.buttons.splice(this.selectedButtonIndex, 1, newButtonConfig);
        tmpConfigs[pathInfo.deviceIndex].profiles[pathInfo.profileIndex].pages[
          pathInfo.pageIndex
        ] = pathInfo.buttons;
        this.configs = tmpConfigs;
      }
    },
    onDndPageChange(page) {
      this.page = page;
    },
  },
};
</script>
