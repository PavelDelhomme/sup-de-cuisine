module.exports = {
  testEnvironment: "jest-environment-jsdom", // Simule un DOM pour vos tests
  transform: {}, // Pas de transformations additionnelles
  setupFilesAfterEnv: ["<rootDir>/scripts/setupTests.js"],
  moduleDirectories: ["node_modules", "<rootDir>/scripts"], // Résolution des chemins relatifs
  moduleNameMapper: {
      "^.+\\.(css|less|scss|sass)$": "identity-obj-proxy", // Gérer les styles
  },
};
