// mock import.meta.env for Jest
globalThis.import = {
  meta: {
    env: {
      VITE_GITBOOK_LINK: "https://mock-gitbook-link.test",
    },
  },
};
