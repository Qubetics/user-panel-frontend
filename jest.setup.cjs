require("@testing-library/jest-dom");

globalThis.import = {
  meta: {
    env: {
      VITE_GITBOOK_LINK: "https://mock-gitbook-link.test",
    },
  },
};

Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: jest.fn().mockImplementation(() => ({
    matches: false,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),

});
