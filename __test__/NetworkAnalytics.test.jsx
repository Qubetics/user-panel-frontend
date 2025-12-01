import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import NetworkAnalytics from "@/components/landingPage/NetworkAnalytics";
import axios from "axios";

jest.mock("axios");

jest.mock("@/styles/components/landingPage/network-analytics.scss", () => ({}));

jest.mock("@/Common/StatCard/StatCard", () => (props) => (
  <div data-testid="stat-card">
    <div>{props.label}</div>
    <div>{props.value}</div>
    <div>{props.icon ? "icon" : ""}</div>
  </div>
));

jest.mock("@/assets/StoreAsset/StoreAsset", () => ({
  CountriesIcon: () => <div data-testid="country-icon" />,
  NodesIcon: () => <div data-testid="nodes-icon" />,
  GroupUserIcon: () => <div data-testid="users-icon" />,
}));

jest.mock("@/Constant/envConstants", () => ({
  env: { explorerApiUrl: "https://example.com" },
}));

jest.mock("@/Constant/apiUrls", () => ({
  apiUrls: { getNetworkAnalytics: "/analytics" },
}));

describe("NetworkAnalytics Component", () => {
  let consoleSpy;

  beforeEach(() => {
    // Mock console.error to suppress logs
    consoleSpy = jest.spyOn(console, "error").mockImplementation(() => {});
    
    // Default mock for axios to prevent crashes
    axios.get.mockResolvedValue({
      data: {
        error: false,
        data: {}
      }
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
    consoleSpy.mockRestore();
  });

  test("renders heading correctly", async () => {
    render(<NetworkAnalytics />);
    expect(screen.getByText("Network Analytics")).toBeInTheDocument();
    
    // Wait for the effect to complete to avoid act warnings
    await waitFor(() => expect(axios.get).toHaveBeenCalled());
  });

  test("calls API and renders stats from response", async () => {
    axios.get.mockResolvedValueOnce({
      data: {
        error: false,
        data: {
          total_country: 10,
          active_nodes: 25,
          total_user: 100,
        },
      },
    });

    render(<NetworkAnalytics />);

    await waitFor(() =>
      expect(axios.get).toHaveBeenCalledWith("https://example.com/analytics")
    );

    expect(screen.getByText("Total Countries")).toBeInTheDocument();
    expect(screen.getByText("10")).toBeInTheDocument();

    expect(screen.getByText("dVPN Nodes Online")).toBeInTheDocument();
    expect(screen.getByText("25")).toBeInTheDocument();

    expect(screen.getByText("Total Users")).toBeInTheDocument();
    expect(screen.getByText("100")).toBeInTheDocument();

    expect(screen.getAllByTestId("stat-card").length).toBe(3);
  });

  test("renders default 0 values when no analytics loaded", async () => {
    axios.get.mockResolvedValueOnce({
      data: { error: false, data: {} },
    });

    render(<NetworkAnalytics />);

    await waitFor(() => expect(axios.get).toHaveBeenCalled());

    expect(screen.getAllByText("0").length).toBeGreaterThan(1);
  });

  test("handles API error without breaking UI", async () => {
    axios.get.mockRejectedValueOnce(new Error("Network error"));

    render(<NetworkAnalytics />);

    await waitFor(() => expect(axios.get).toHaveBeenCalledTimes(1));

    expect(consoleSpy).toHaveBeenCalledWith("Error fetching analytics:", expect.any(Error));
    expect(screen.getByText("Network Analytics")).toBeInTheDocument();
    expect(screen.getAllByTestId("stat-card").length).toBe(3);
  });

  test("handles API success but response.error = true (does not set analytics)", async () => {
    axios.get.mockResolvedValueOnce({
      data: {
        error: true,
        data: {
          total_country: 10,
          active_nodes: 20,
          total_user: 100,
        },
      },
    });

    render(<NetworkAnalytics />);

    await waitFor(() => expect(axios.get).toHaveBeenCalled());

    const zeros = screen.getAllByText("0");
    expect(zeros.length).toBeGreaterThan(1);
  });
});
