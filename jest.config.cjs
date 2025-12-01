module.exports = {
  testEnvironment: "jsdom",

  extensionsToTreatAsEsm: [".jsx"],

  transform: {
    "^.+\\.(js|jsx|ts|tsx)$": [
      "babel-jest",
    ],
  },

  transformIgnorePatterns: [],

  setupFiles: ["<rootDir>/__mocks__/importMetaMock.js"],
  setupFilesAfterEnv: ["<rootDir>/jest.setup.cjs"],

  moduleNameMapper: {
    "\\.(css|scss|sass)$": "identity-obj-proxy",
    "^@/(.*)$": "<rootDir>/src/$1",
    "\\.(svg|png|jpg)$": "<rootDir>/__mocks__/fileMock.js",
  },

  moduleFileExtensions: ["js", "jsx", "ts", "tsx"],

  testPathIgnorePatterns: [
    "<rootDir>/__test__/PrivateRoute.test.jsx",
  ],

  coveragePathIgnorePatterns: [
    "<rootDir>/src/Common/ButtonCustom/ButtonCustom.jsx",
    "<rootDir>/src/assets/StoreAsset/StoreAsset.jsx",
    "<rootDir>/src/Hooks/useGetApi.jsx",
    "<rootDir>/src/Constant/apiUrls.jsx",
    "<rootDir>/src/Constant/constants.jsx",
    "<rootDir>/__test__/PrivateRoute.test.jsx",
    "<rootDir>/src/PrivateRoute.jsx",   
  ],
};
