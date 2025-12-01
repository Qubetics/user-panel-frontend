const { TextEncoder, TextDecoder } = require('util');
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

const { render, screen, act } = require("@testing-library/react");
const { BrowserRouter, MemoryRouter } = require("react-router-dom");
const React = require("react");
const App = require("@/App").default;

// Mock all child components
jest.mock("@/Hooks/useGetApi", () => ({
  __esModule: true,
  default: jest.fn(() => Promise.resolve({ data: [] }))
}));

jest.mock("@/components/activity", () => ({
  __esModule: true,
  default: () => <div data-testid="activity">Activity</div>
}));

jest.mock("@/Constant/envConstants", () => ({
  env: {
    baseApiUrls: "https://api.qubetics.com",
    chainId: "test-chain-1",
    swagger_api: "https://api.qubetics.com",
    currency: "tics",
    explorer_link: "https://explorer.qubetics.com",
    app_link: "https://app.qubetics.com",
  },
}));

jest.mock("@/components/Header", () => {
  return function Header() {
    return <div data-testid="header">Header</div>;
  };
});

jest.mock("@/components/Footer", () => {
  return function Footer() {
    return <div data-testid="footer">Footer</div>;
  };
});

jest.mock("@/components/landingPage", () => {
  return function LandingPage() {
    return <div data-testid="landing-page">Landing Page</div>;
  };
});

jest.mock("@/components/register", () => {
  return function Register() {
    return <div data-testid="register-page">Register Page</div>;
  };
});

jest.mock("@/Context/LoggedInContext", () => ({
  LoggedInProvider: ({ children }) => <div data-testid="logged-in-provider">{children}</div>,
}));

jest.mock("react-toastify", () => ({
  ToastContainer: () => <div data-testid="toast-container">Toast Container</div>,
}));

describe("App Component", () => {
  test("renders App component with all main elements", () => {
    render(
      <BrowserRouter>
        <App />
      </BrowserRouter>
    );

    expect(screen.getByTestId("toast-container")).toBeInTheDocument();
    expect(screen.getByTestId("logged-in-provider")).toBeInTheDocument();
    expect(screen.getByTestId("header")).toBeInTheDocument();
    expect(screen.getByTestId("footer")).toBeInTheDocument();
  });

  test("renders LandingPage on root path", () => {
    render(
      <MemoryRouter initialEntries={["/"]}>
        <App />
      </MemoryRouter>
    );

    expect(screen.getByTestId("landing-page")).toBeInTheDocument();
    expect(screen.queryByTestId("register-page")).not.toBeInTheDocument();
  });

  test("renders Register page on /register path", () => {
    render(
      <MemoryRouter initialEntries={["/register"]}>
        <App />
      </MemoryRouter>
    );

    expect(screen.getByTestId("register-page")).toBeInTheDocument();
    expect(screen.queryByTestId("landing-page")).not.toBeInTheDocument();
  });

  test("adds register-page class to body on /register route", () => {
    // Clear any existing classes first
    document.body.className = "";
    
    // Start on register page
    const { unmount } = render(
      <MemoryRouter initialEntries={["/register"]}>
        <App />
      </MemoryRouter>
    );

    // Check if class is added
    expect(document.body.classList.contains("register-page")).toBe(true);

    // Unmount and remount with different route
    unmount();
    
    render(
      <MemoryRouter initialEntries={["/"]}>
        <App />
      </MemoryRouter>
    );

    expect(document.body.classList.contains("register-page")).toBe(false);
  });

  test("removes register-page class when navigating away from register", () => {
    // Clear any existing classes first
    document.body.className = "";
    
    // Start on register page
    const { unmount } = render(
      <MemoryRouter initialEntries={["/register"]}>
        <App />
      </MemoryRouter>
    );

    expect(document.body.classList.contains("register-page")).toBe(true);

    // Unmount and remount with home route
    unmount();
    
    render(
      <MemoryRouter initialEntries={["/"]}>
        <App />
      </MemoryRouter>
    );

    expect(document.body.classList.contains("register-page")).toBe(false);
  });

  test("renders with correct structure", () => {
    const { container } = render(
      <BrowserRouter>
        <App />
      </BrowserRouter>
    );

    const mainDiv = container.querySelector(".min-h-screen");
    expect(mainDiv).toBeInTheDocument();
  });
});
