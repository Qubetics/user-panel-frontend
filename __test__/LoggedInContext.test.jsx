import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { LoggedInProvider, useIsLoggedIn, MyLoggedInContext } from "@/Context/LoggedInContext";

// Test component that uses the context
const TestComponent = () => {
  const { authData, status, request, setAuthData, setStatus, setRequest } = useIsLoggedIn();

  return (
    <div>
      <div data-testid="auth-data">{authData}</div>
      <div data-testid="status">{status}</div>
      <div data-testid="request">{request}</div>
      <button onClick={() => setAuthData("test-address")}>Set Auth Data</button>
      <button onClick={() => setStatus("ACTIVE")}>Set Status</button>
      <button onClick={() => setRequest("LINK")}>Set Request</button>
    </div>
  );
};

// Test component that directly accesses context
const DirectContextComponent = () => {
  return (
    <MyLoggedInContext.Consumer>
      {(context) => (
        <div>
          <div data-testid="direct-auth">{context?.authData || ""}</div>
          <div data-testid="direct-status">{context?.status || ""}</div>
          <div data-testid="direct-request">{context?.request || ""}</div>
        </div>
      )}
    </MyLoggedInContext.Consumer>
  );
};

describe("LoggedInContext", () => {
  test("provides default values", () => {
    render(
      <LoggedInProvider>
        <TestComponent />
      </LoggedInProvider>
    );

    expect(screen.getByTestId("auth-data")).toHaveTextContent("");
    expect(screen.getByTestId("status")).toHaveTextContent("");
    expect(screen.getByTestId("request")).toHaveTextContent("");
  });

  test("provides context through useIsLoggedIn hook", () => {
    render(
      <LoggedInProvider>
        <TestComponent />
      </LoggedInProvider>
    );

    expect(screen.getByText("Set Auth Data")).toBeInTheDocument();
    expect(screen.getByText("Set Status")).toBeInTheDocument();
    expect(screen.getByText("Set Request")).toBeInTheDocument();
  });

  test("allows updating auth data", () => {
    render(
      <LoggedInProvider>
        <TestComponent />
      </LoggedInProvider>
    );

    const setAuthButton = screen.getByText("Set Auth Data");
    fireEvent.click(setAuthButton);

    expect(screen.getByTestId("auth-data")).toHaveTextContent("test-address");
  });

  test("allows updating status", () => {
    render(
      <LoggedInProvider>
        <TestComponent />
      </LoggedInProvider>
    );

    const setStatusButton = screen.getByText("Set Status");
    fireEvent.click(setStatusButton);

    expect(screen.getByTestId("status")).toHaveTextContent("ACTIVE");
  });

  test("allows updating request", () => {
    render(
      <LoggedInProvider>
        <TestComponent />
      </LoggedInProvider>
    );

    const setRequestButton = screen.getByText("Set Request");
    fireEvent.click(setRequestButton);

    expect(screen.getByTestId("request")).toHaveTextContent("LINK");
  });

  test("provides context through direct context access", () => {
    render(
      <LoggedInProvider>
        <DirectContextComponent />
      </LoggedInProvider>
    );

    expect(screen.getByTestId("direct-auth")).toHaveTextContent("");
    expect(screen.getByTestId("direct-status")).toHaveTextContent("");
    expect(screen.getByTestId("direct-request")).toHaveTextContent("");
  });

  test("context values are shared between components", () => {
    const TestComponent1 = () => {
      const { setAuthData } = useIsLoggedIn();
      return <button onClick={() => setAuthData("shared-address")}>Set Shared</button>;
    };

    const TestComponent2 = () => {
      const { authData } = useIsLoggedIn();
      return <div data-testid="shared-auth">{authData}</div>;
    };

    render(
      <LoggedInProvider>
        <TestComponent1 />
        <TestComponent2 />
      </LoggedInProvider>
    );

    expect(screen.getByTestId("shared-auth")).toHaveTextContent("");

    const setButton = screen.getByText("Set Shared");
    fireEvent.click(setButton);

    expect(screen.getByTestId("shared-auth")).toHaveTextContent("shared-address");
  });

  test("multiple state updates work correctly", () => {
    render(
      <LoggedInProvider>
        <TestComponent />
      </LoggedInProvider>
    );

    // Set all values
    fireEvent.click(screen.getByText("Set Auth Data"));
    fireEvent.click(screen.getByText("Set Status"));
    fireEvent.click(screen.getByText("Set Request"));

    expect(screen.getByTestId("auth-data")).toHaveTextContent("test-address");
    expect(screen.getByTestId("status")).toHaveTextContent("ACTIVE");
    expect(screen.getByTestId("request")).toHaveTextContent("LINK");
  });

  test("context provider renders children", () => {
    render(
      <LoggedInProvider>
        <div data-testid="child-content">Child Content</div>
      </LoggedInProvider>
    );

    expect(screen.getByTestId("child-content")).toBeInTheDocument();
    expect(screen.getByText("Child Content")).toBeInTheDocument();
  });

  test("useIsLoggedIn throws error when used outside provider", () => {
    // Suppress console.error for this test
    const originalError = console.error;
    console.error = jest.fn();

    expect(() => {
      render(<TestComponent />);
    }).toThrow();

    console.error = originalError;
  });

  test("context maintains state across re-renders", () => {
    const { rerender } = render(
      <LoggedInProvider>
        <TestComponent />
      </LoggedInProvider>
    );

    // Set initial state
    fireEvent.click(screen.getByText("Set Auth Data"));
    expect(screen.getByTestId("auth-data")).toHaveTextContent("test-address");

    // Re-render with same provider
    rerender(
      <LoggedInProvider>
        <TestComponent />
      </LoggedInProvider>
    );

    // State should be preserved
    expect(screen.getByTestId("auth-data")).toHaveTextContent("test-address");
  });

  test("nested providers work correctly", () => {
    const OuterComponent = () => {
      const { setAuthData } = useIsLoggedIn();
      return (
        <div>
          <button onClick={() => setAuthData("outer-value")}>Set Outer</button>
          <LoggedInProvider>
            <TestComponent />
          </LoggedInProvider>
        </div>
      );
    };

    render(
      <LoggedInProvider>
        <OuterComponent />
      </LoggedInProvider>
    );

    // Outer provider should not affect inner component
    fireEvent.click(screen.getByText("Set Outer"));
    expect(screen.getByTestId("auth-data")).toHaveTextContent("");
  });

  test("context can be used with multiple components", () => {
    const ComponentA = () => {
      const { authData, setAuthData } = useIsLoggedIn();
      return (
        <div>
          <div data-testid="comp-a">{authData}</div>
          <button onClick={() => setAuthData("from-a")}>Set from A</button>
        </div>
      );
    };

    const ComponentB = () => {
      const { authData, setAuthData } = useIsLoggedIn();
      return (
        <div>
          <div data-testid="comp-b">{authData}</div>
          <button onClick={() => setAuthData("from-b")}>Set from B</button>
        </div>
      );
    };

    render(
      <LoggedInProvider>
        <ComponentA />
        <ComponentB />
      </LoggedInProvider>
    );

    expect(screen.getByTestId("comp-a")).toHaveTextContent("");
    expect(screen.getByTestId("comp-b")).toHaveTextContent("");

    fireEvent.click(screen.getByText("Set from A"));
    expect(screen.getByTestId("comp-a")).toHaveTextContent("from-a");
    expect(screen.getByTestId("comp-b")).toHaveTextContent("from-a");

    fireEvent.click(screen.getByText("Set from B"));
    expect(screen.getByTestId("comp-a")).toHaveTextContent("from-b");
    expect(screen.getByTestId("comp-b")).toHaveTextContent("from-b");
  });
});
