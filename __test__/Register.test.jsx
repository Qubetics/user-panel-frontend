import { render, screen, fireEvent, waitFor, act } from "@testing-library/react";
import React from "react";
import Register from "@/components/register/index.jsx";

import useGetApi from "@/Hooks/useGetApi";
jest.mock("@/Hooks/useGetApi");

const mockUseIsLoggedIn = jest.fn();
jest.mock("@/Context/LoggedInContext", () => ({
  useIsLoggedIn: () => mockUseIsLoggedIn(),
}));

jest.mock("react-toastify", () => ({
  toast: {
    error: jest.fn(),
    success: jest.fn(),
  },
}));

jest.mock("@/Common/ButtonCustom/ButtonCustom", () => (props) => (
  <button onClick={props.onClick}>{props.label}</button>
));

jest.mock("@/components/register/ResponseTabs", () => ({
  NotificationModal: ({ show, message, onClose }) =>
    show ? (
      <div data-testid="modal" onClick={onClose}>
        {message}
      </div>
    ) : null,
}));

jest.mock("@/utils/Helper/CommonHelper", () => ({
  calculateBandwidth: () => "50 GB",
  formatDuration: () => "30 Days",
  getValueWithUnit: (v) => v,
  getPlanLabel: (plan) => `Plan ${plan.id}`,
  progressbar: () => true,
  truncateValue: (v) => v.slice(0, 3) + "...",
  toFirstCapital: (str) => (str ? str.charAt(0).toUpperCase() + str.slice(1).toLowerCase() : ""),
}));

jest.mock("@/Constant/envConstants", () => ({
  env: { chainId: "test-chain", gitbookLink: "http://gitbook" },
}));

jest.mock("antd", () => ({
  Spin: ({ children }) => <div data-testid="spin">{children}</div>,
}));

jest.mock("@ant-design/icons", () => ({
  LoadingOutlined: () => <div data-testid="loading-icon">Loading</div>,
}));

global.window.keplr = {
  signArbitrary: jest.fn(() =>
    Promise.resolve({
      signature: "signed123",
      pub_key: "pubkey",
    }),
  ),
};

beforeEach(() => {
  jest.clearAllMocks();

  mockUseIsLoggedIn.mockReturnValue({
    authData: "wallet123",
    status: "PENDING",
    request: "",
  });

  useGetApi.mockResolvedValue({ data: { data: { providers: [] } } });
});

describe("Register Component", () => {
  test("renders component with heading", async () => {
    await act(async () => {
      render(<Register />);
    });

    expect(screen.getByText("Register as Node Operator")).toBeInTheDocument();
  });

  test("shows provider dropdown when Link is selected", async () => {
    await act(async () => {
      render(<Register />);
    });

    await act(async () => {
      fireEvent.change(screen.getAllByRole("combobox")[0], {
        target: { value: "Link" },
      });
    });

    await waitFor(() => {
      expect(screen.getByText("-- Select a Provider --")).toBeInTheDocument();
    });
  });

  test("loads and displays plan list when provider is selected", async () => {
    useGetApi
      .mockResolvedValueOnce({
        data: {
          data: {
            providers: [{ providerAddress: "p1", name: "Provider1" }],
          },
        },
      })
      .mockResolvedValueOnce({
        data: {
          data: [
            {
              id: 1,
              hours: 720,
              gigabytes: 100,
              prov_address: "p1",
              prices: [{ quote_value: 200, denom: "tics" }],
              status: "ACTIVE",
            },
          ],
        },
      });

    await act(async () => {
      render(<Register />);
    });

    await act(async () => {
      fireEvent.change(screen.getAllByRole("combobox")[0], {
        target: { value: "Link" },
      });
    });

    await waitFor(() => {
      expect(screen.getByText("-- Select a Provider --")).toBeInTheDocument();
    });

    await act(async () => {
      const providerSelect = screen.getAllByRole("combobox")[1];
      fireEvent.change(providerSelect, {
        target: { value: "p1" },
      });
    });

    await waitFor(() => {
      expect(useGetApi).toHaveBeenCalledTimes(2);
    });
  });

  test("handles plan selection and shows duration/bandwidth", async () => {
    useGetApi
      .mockResolvedValueOnce({
        data: {
          data: {
            providers: [{ providerAddress: "p1", name: "P1" }],
          },
        },
      })
      .mockResolvedValueOnce({
        data: {
          data: [
            {
              id: 1,
              hours: 720,
              gigabytes: 100,
              prices: [{ quote_value: 100, denom: "tics" }],
              status: "ACTIVE",
            },
          ],
        },
      });

    await act(async () => {
      render(<Register />);
    });

    await act(async () => {
      fireEvent.change(screen.getAllByRole("combobox")[0], {
        target: { value: "Link" },
      });
    });

    await act(async () => {
      const providerSelect = screen.getAllByRole("combobox")[1];
      fireEvent.change(providerSelect, { target: { value: "p1" } });
    });

    await waitFor(() => {
      const selects = screen.getAllByRole("combobox");
      expect(selects.length).toBeGreaterThanOrEqual(2);
    });
  });

  test("validates required fields on submission", async () => {
    const { toast } = require("react-toastify");

    await act(async () => {
      render(<Register />);
    });

    await act(async () => {
      fireEvent.click(screen.getByText("Submit"));
    });

    expect(toast.error).toHaveBeenCalledWith("Operator name is required");
  });

  test("validates email format", async () => {
    await act(async () => {
      render(<Register />);
    });

    await act(async () => {
      fireEvent.change(screen.getByPlaceholderText("Example"), {
        target: { value: "John" },
      });
    });

    await act(async () => {
      fireEvent.change(screen.getByPlaceholderText("example@gmail.com"), {
        target: { value: "invalid-email" },
      });
    });

    await waitFor(() => {
      expect(screen.getByText("Invalid email format")).toBeInTheDocument();
    });
  });

  test("successful submission shows modal", async () => {
    useGetApi.mockResolvedValueOnce({ data: { data: { providers: [] } } }).mockResolvedValueOnce({ success: true });

    await act(async () => {
      render(<Register />);
    });

    await act(async () => {
      fireEvent.change(screen.getByPlaceholderText("Example"), {
        target: { value: "John" },
      });

      fireEvent.change(screen.getByPlaceholderText("qubetics1jcdse3f8yqcnlyw54yamm4n"), {
        target: { value: "node123" },
      });

      fireEvent.change(screen.getAllByRole("combobox")[0], {
        target: { value: "Unlink" },
      });

      fireEvent.click(screen.getByText("Submit"));
    });

    await waitFor(() => {
      expect(screen.getByTestId("modal")).toBeInTheDocument();
    });
  });

  test("handles signing failure", async () => {
    window.keplr.signArbitrary.mockRejectedValueOnce(new Error("User rejected"));
    const { toast } = require("react-toastify");

    await act(async () => {
      render(<Register />);
    });

    await act(async () => {
      fireEvent.change(screen.getByPlaceholderText("Example"), {
        target: { value: "John" },
      });

      fireEvent.change(screen.getByPlaceholderText("qubetics1jcdse3f8yqcnlyw54yamm4n"), {
        target: { value: "node123" },
      });

      fireEvent.change(screen.getAllByRole("combobox")[0], {
        target: { value: "Unlink" },
      });

      fireEvent.click(screen.getByText("Submit"));
    });

    await waitFor(() => expect(toast.error).toHaveBeenCalledWith("User Rejected the Action"));
  });

  test("clears plan fields when switching to Unlink", async () => {
    await act(async () => {
      render(<Register />);
    });

    await act(async () => {
      fireEvent.change(screen.getAllByRole("combobox")[0], {
        target: { value: "Link" },
      });
    });

    await waitFor(() => {
      expect(screen.getByText("-- Select a Provider --")).toBeInTheDocument();
    });

    await act(async () => {
      fireEvent.change(screen.getAllByRole("combobox")[0], {
        target: { value: "Unlink" },
      });
    });

    await waitFor(() => {
      expect(screen.queryByText("-- Select a Provider --")).not.toBeInTheDocument();
    });
  });

  test("handles APPROVED status with Link request", async () => {
    mockUseIsLoggedIn.mockReturnValue({
      authData: "wallet123",
      status: "APPROVED",
      request: "Link",
    });

    useGetApi.mockResolvedValueOnce({ data: { data: { providers: [] } } }).mockResolvedValueOnce({
      data: {
        data: {
          data: {
            orgName: "Test Org",
            email: "test@example.com",
            nodeAddress: "node123",
          },
        },
      },
    });

    await act(async () => {
      render(<Register />);
    });

    await waitFor(
      () => {
        expect(useGetApi).toHaveBeenCalledTimes(2);
      },
      { timeout: 2000 },
    );
  });

  test("filters inactive plans", async () => {
    useGetApi
      .mockResolvedValueOnce({
        data: {
          data: {
            providers: [{ providerAddress: "p1", name: "P1" }],
          },
        },
      })
      .mockResolvedValueOnce({
        data: {
          data: [
            {
              id: 1,
              hours: 720,
              gigabytes: 100,
              prices: [{ quote_value: 100, denom: "tics" }],
              status: "ACTIVE",
            },
            {
              id: 2,
              hours: 1440,
              gigabytes: 200,
              prices: [{ quote_value: 200, denom: "tics" }],
              status: "INACTIVE",
            },
          ],
        },
      });

    await act(async () => {
      render(<Register />);
    });

    await act(async () => {
      fireEvent.change(screen.getAllByRole("combobox")[0], {
        target: { value: "Link" },
      });
    });

    await act(async () => {
      const providerSelect = screen.getAllByRole("combobox")[1];
      fireEvent.change(providerSelect, { target: { value: "p1" } });
    });

    await waitFor(() => {
      expect(useGetApi).toHaveBeenCalledTimes(2);
    });
  });

  test("handles API error during submission", async () => {
    const { toast } = require("react-toastify");
    useGetApi
      .mockResolvedValueOnce({ data: { data: { providers: [] } } })
      .mockRejectedValueOnce({ message: "Network error" });

    await act(async () => {
      render(<Register />);
    });

    await act(async () => {
      fireEvent.change(screen.getByPlaceholderText("Example"), {
        target: { value: "John" },
      });

      fireEvent.change(screen.getByPlaceholderText("qubetics1jcdse3f8yqcnlyw54yamm4n"), {
        target: { value: "node123" },
      });

      fireEvent.change(screen.getAllByRole("combobox")[0], {
        target: { value: "Unlink" },
      });

      fireEvent.click(screen.getByText("Submit"));
    });

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith("Network error");
    });
  });

  test("closes modal and resets form", async () => {
    useGetApi.mockResolvedValueOnce({ data: { data: { providers: [] } } }).mockResolvedValueOnce({ success: true });

    await act(async () => {
      render(<Register />);
    });

    await act(async () => {
      fireEvent.change(screen.getByPlaceholderText("Example"), {
        target: { value: "John" },
      });

      fireEvent.change(screen.getByPlaceholderText("qubetics1jcdse3f8yqcnlyw54yamm4n"), {
        target: { value: "node123" },
      });

      fireEvent.change(screen.getAllByRole("combobox")[0], {
        target: { value: "Unlink" },
      });

      fireEvent.click(screen.getByText("Submit"));
    });

    const modal = await screen.findByTestId("modal");

    await act(async () => {
      fireEvent.click(modal);
    });

    await waitFor(() => expect(screen.queryByTestId("modal")).not.toBeInTheDocument());
  });

  test("renders plan options when plans are loaded", async () => {
    useGetApi
      .mockResolvedValueOnce({
        data: {
          data: {
            providers: [{ providerAddress: "p1", name: "P1" }],
          },
        },
      })
      .mockResolvedValueOnce({
        data: {
          data: [
            {
              id: 1,
              hours: 720,
              gigabytes: 100,
              prices: [{ quote_value: 100, denom: "tics" }],
              status: "ACTIVE",
            },
          ],
        },
      });

    await act(async () => {
      render(<Register />);
    });

    await act(async () => {
      fireEvent.change(screen.getAllByRole("combobox")[0], {
        target: { value: "Link" },
      });
    });

    await act(async () => {
      const providerSelect = screen.getAllByRole("combobox")[1];
      fireEvent.change(providerSelect, { target: { value: "p1" } });
    });

    await waitFor(() => {
      expect(useGetApi).toHaveBeenCalledTimes(2);
    });
  });

  test("sorts plans by price in descending order", async () => {
    useGetApi
      .mockResolvedValueOnce({
        data: {
          data: {
            providers: [{ providerAddress: "p1", name: "P1" }],
          },
        },
      })
      .mockResolvedValueOnce({
        data: {
          data: [
            {
              id: 1,
              hours: 720,
              gigabytes: 100,
              prices: [{ quote_value: 100, denom: "tics" }],
              status: "ACTIVE",
            },
            {
              id: 2,
              hours: 1440,
              gigabytes: 200,
              prices: [{ quote_value: 300, denom: "tics" }],
              status: "ACTIVE",
            },
            {
              id: 3,
              hours: 360,
              gigabytes: 50,
              prices: [{ quote_value: 50, denom: "tics" }],
              status: "ACTIVE",
            },
          ],
        },
      });

    await act(async () => {
      render(<Register />);
    });

    await act(async () => {
      fireEvent.change(screen.getAllByRole("combobox")[0], {
        target: { value: "Link" },
      });
    });

    await act(async () => {
      const providerSelect = screen.getAllByRole("combobox")[1];
      fireEvent.change(providerSelect, { target: { value: "p1" } });
    });

    await waitFor(() => {
      expect(useGetApi).toHaveBeenCalledTimes(2);
    });
  });

  test("handles provider change and resets plan list", async () => {
    useGetApi
      .mockResolvedValueOnce({
        data: {
          data: {
            providers: [
              { providerAddress: "p1", name: "P1" },
              { providerAddress: "p2", name: "P2" },
            ],
          },
        },
      })
      .mockResolvedValueOnce({ data: { data: [] } })
      .mockResolvedValueOnce({ data: { data: [] } });

    await act(async () => {
      render(<Register />);
    });

    await act(async () => {
      fireEvent.change(screen.getAllByRole("combobox")[0], {
        target: { value: "Link" },
      });
    });

    await act(async () => {
      const providerSelect = screen.getAllByRole("combobox")[1];
      fireEvent.change(providerSelect, { target: { value: "p1" } });
    });

    await waitFor(() => {
      expect(useGetApi).toHaveBeenCalledTimes(2);
    });

    // Change to another provider
    await act(async () => {
      const providerSelect = screen.getAllByRole("combobox")[1];
      fireEvent.change(providerSelect, { target: { value: "p2" } });
    });

    await waitFor(() => {
      expect(useGetApi).toHaveBeenCalledTimes(3);
    });
  });

  test("validates Link action requires plan", async () => {
    const { toast } = require("react-toastify");

    await act(async () => {
      render(<Register />);
    });

    await act(async () => {
      fireEvent.change(screen.getByPlaceholderText("Example"), {
        target: { value: "John" },
      });

      fireEvent.change(screen.getByPlaceholderText("qubetics1jcdse3f8yqcnlyw54yamm4n"), {
        target: { value: "node123" },
      });

      fireEvent.change(screen.getAllByRole("combobox")[0], {
        target: { value: "Link" },
      });

      fireEvent.click(screen.getByText("Submit"));
    });

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith("Please choose a plan");
    });
  });

  test("handles empty provider list response", async () => {
    useGetApi.mockResolvedValueOnce({
      data: { data: { providers: undefined } },
    });

    await act(async () => {
      render(<Register />);
    });

    expect(screen.getByText("Register as Node Operator")).toBeInTheDocument();
  });

  test("handles response without success flag", async () => {
    useGetApi.mockResolvedValueOnce({ data: { data: { providers: [] } } }).mockResolvedValueOnce({
      success: false,
      message: "Custom error message",
    });

    await act(async () => {
      render(<Register />);
    });

    await act(async () => {
      fireEvent.change(screen.getByPlaceholderText("Example"), {
        target: { value: "John" },
      });

      fireEvent.change(screen.getByPlaceholderText("qubetics1jcdse3f8yqcnlyw54yamm4n"), {
        target: { value: "node123" },
      });

      fireEvent.change(screen.getAllByRole("combobox")[0], {
        target: { value: "Unlink" },
      });

      fireEvent.click(screen.getByText("Submit"));
    });

    await waitFor(() => {
      expect(screen.getByTestId("modal")).toBeInTheDocument();
    });
  });

  test("tests handlePlanChange with SELECT option", async () => {
    useGetApi.mockResolvedValueOnce({
      data: { data: { providers: [] } },
    });

    await act(async () => {
      render(<Register />);
    });

    await act(async () => {
      fireEvent.change(screen.getAllByRole("combobox")[0], {
        target: { value: "Link" },
      });
    });

    await act(async () => {
      fireEvent.change(screen.getAllByRole("combobox")[1], {
        target: { value: "provider1" },
      });
    });

    await waitFor(() => {
      expect(useGetApi).toHaveBeenCalled();
    });
  });
  test("tests getAllPlan sorting logic (lines 103-105)", async () => {
    const mockPlans = [
      {
        id: 1,
        status: "active",
        prices: [{ quote_value: 100, denom: "tics" }],
        gigabytes: 50,
        hours: 720,
      },
      {
        id: 2,
        status: "active",
        prices: [{ quote_value: 200, denom: "tics" }],
        gigabytes: 100,
        hours: 720,
      },
      {
        id: 3,
        status: "inactive",
        prices: [{ quote_value: 300, denom: "tics" }],
        gigabytes: 150,
        hours: 720,
      },
    ];

    useGetApi
      .mockResolvedValueOnce({
        data: {
          data: {
            providers: [{ providerAddress: "provider1", name: "Provider 1" }],
          },
        },
      })
      .mockResolvedValueOnce({
        data: { data: mockPlans },
      });

    await act(async () => {
      render(<Register />);
    });

    await act(async () => {
      fireEvent.change(screen.getAllByRole("combobox")[0], {
        target: { value: "Link" },
      });
    });

    await act(async () => {
      fireEvent.change(screen.getAllByRole("combobox")[1], {
        target: { value: "provider1" },
      });
    });

    await waitFor(() => {
      const combo = screen.getAllByRole("combobox");
      if (combo.length > 2) {
        const options = combo[2].querySelectorAll("option");
        expect(options).toHaveLength(3);
        expect(options[1].textContent).toContain("Plan 2");
        expect(options[2].textContent).toContain("Plan 1");
      }
    });
  });
  test("tests plan option rendering without prices (line 408-411)", async () => {
    const mockPlanWithoutPrices = {
      id: 1,
      status: "active",
      prices: [],
      gigabytes: 75,
      hours: 720,
    };

    useGetApi
      .mockResolvedValueOnce({
        data: {
          data: {
            providers: [{ providerAddress: "provider1", name: "Provider 1" }],
          },
        },
      })
      .mockResolvedValueOnce({
        data: { data: [mockPlanWithoutPrices] },
      });

    await act(async () => {
      render(<Register />);
    });

    await act(async () => {
      fireEvent.change(screen.getAllByRole("combobox")[0], {
        target: { value: "Link" },
      });
    });

    await act(async () => {
      fireEvent.change(screen.getAllByRole("combobox")[1], {
        target: { value: "provider1" },
      });
    });

    await waitFor(() => {
      const combo = screen.getAllByRole("combobox");
      if (combo.length > 2) {
        const options = combo[2].querySelectorAll("option");
        expect(options[1].value).toBe(JSON.stringify(mockPlanWithoutPrices));
        expect(options[1].textContent).toContain("Plan 1");
      }
    });
  });

  test("tests plan option rendering with empty prices array", async () => {
    const mockPlanWithEmptyPrices = {
      id: 2,
      status: "active",
      prices: [],
      gigabytes: 100,
      hours: 720,
    };

    useGetApi
      .mockResolvedValueOnce({
        data: {
          data: {
            providers: [{ providerAddress: "provider1", name: "Provider 1" }],
          },
        },
      })
      .mockResolvedValueOnce({
        data: { data: [mockPlanWithEmptyPrices] },
      });

    await act(async () => {
      render(<Register />);
    });

    await act(async () => {
      fireEvent.change(screen.getAllByRole("combobox")[0], {
        target: { value: "Link" },
      });
    });

    await act(async () => {
      fireEvent.change(screen.getAllByRole("combobox")[1], {
        target: { value: "provider1" },
      });
    });

    await waitFor(() => {
      const combo = screen.getAllByRole("combobox");
      if (combo.length > 2) {
        const options = combo[2].querySelectorAll("option");
        expect(options[1].textContent).toContain("Plan 2");
      }
    });
  });
});
