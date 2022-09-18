export const wsMessages = {
  getConfig: {
    type: "getConfig",
  },
  setConfig: {
    type: "setConfig",
    data: {},
  },
};

export const wsResponses = {
  getConfig: {
    type: "getConfig",
  },
};

export const getDummyButton = (buttonIndex) => ({
  type: "",
  options: {},
  buttonIndex,
});

export const getDefaultButton = (button) => ({
  type: button.type,
  options: {
    icon: button.options.icon,
    backgroundColor: button.options.backgroundColor,
    pressedIcon: button.options.pressedIcon,
    text: button.options.text,
    textColor: button.options.textColor,
    textSize: button.options.textSize,
    textAlignment: button.options.textAlignment,
  },
  buttonIndex: button.buttonIndex,
});
