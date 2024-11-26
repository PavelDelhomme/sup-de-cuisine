export default {
    testEnvironment: "jsdom",
    transform: {},
  };
  

  module.exports = {
    testEnvironment: "jsdom",
    moduleDirectories: ["node_modules", "<rootDir>/scripts"],
    moduleNameMapper: {
      "^.+\\.(css|less|scss|sass)$": "identity-obj-proxy"
    }
  };