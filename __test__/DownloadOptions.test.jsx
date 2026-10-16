import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import DownloadOptions from "@/components/landingPage/DownloadOptions";
import { env } from "@/Constant/envConstants";
import { toast } from "react-toastify";

// Mock window.open
const mockWindowOpen = jest.fn();
window.open = mockWindowOpen;

// Mock env constants (the component reads env.appStore_link for the App Store button)
jest.mock("@/Constant/envConstants", () => ({
  env: {
    appStore_link: "https://mock-appstore-link.com",
  },
}));

// Mock toast to avoid errors and track calls
jest.mock("react-toastify", () => ({
  toast: { success: jest.fn() },
}));

// Mock Icons used in component
jest.mock("@/assets/StoreAsset/StoreAsset", () => ({
  IOSIcon: () => <div data-testid="ios-icon" />,
  AndroidIcon: () => <div data-testid="android-icon" />,
}));

describe("DownloadOptions Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders headings correctly", () => {
    render(<DownloadOptions />);

    expect(screen.getByText("Download it now")).toBeInTheDocument();
    expect(
      screen.getByText("Secure,fast and decentralized VPN powered by Qubetics")
    ).toBeInTheDocument();
  });

  it("renders App Store and Play Store buttons", () => {
    render(<DownloadOptions />);

    expect(screen.getByText("App Store")).toBeInTheDocument();
    expect(screen.getByText("Play Store")).toBeInTheDocument();

    expect(screen.getByTestId("ios-icon")).toBeInTheDocument();
    expect(screen.getByTestId("android-icon")).toBeInTheDocument();
  });

  it("opens the App Store link when the App Store button is clicked", () => {
    render(<DownloadOptions />);

    fireEvent.click(screen.getByText("App Store"));

    expect(mockWindowOpen).toHaveBeenCalledWith(env.appStore_link, "_blank");
  });

  it("shows a toast when the Play Store button is clicked", () => {
    render(<DownloadOptions />);

    fireEvent.click(screen.getByText("Play Store"));

    expect(toast.success).toHaveBeenCalledWith("Coming soon");
    expect(mockWindowOpen).not.toHaveBeenCalled();
  });
});
