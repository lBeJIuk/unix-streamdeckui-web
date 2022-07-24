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
  options: { ...button.options },
  buttonIndex: button.buttonIndex,
});
