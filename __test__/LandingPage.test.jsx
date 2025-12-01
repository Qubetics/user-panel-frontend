import { render, screen } from "@testing-library/react";
import React from "react";
import LandingPage from "@/components/landingPage/index";

// Mock all child components
jest.mock("@/components/landingPage/Hero", () => {
  return function Hero() {
    return <div data-testid="hero">Hero Component</div>;
  };
});

jest.mock("@/components/landingPage/HowItWorks", () => {
  return function HowItWorks() {
    return <div data-testid="how-it-works">How It Works Component</div>;
  };
});

jest.mock("@/components/landingPage/NetworkAnalytics", () => {
  return function NetworkAnalytics() {
    return <div data-testid="network-analytics">Network Analytics Component</div>;
  };
});

jest.mock("@/components/landingPage/QuickStart", () => {
  return function QuickStart() {
    return <div data-testid="quick-start">Quick Start Component</div>;
  };
});

jest.mock("@/components/landingPage/DownloadOptions", () => {
  return function DownloadOptions() {
    return <div data-testid="download-options">Download Options Component</div>;
  };
});

describe("LandingPage Component", () => {
  test("renders all child components", () => {
    render(<LandingPage />);

    expect(screen.getByTestId("hero")).toBeInTheDocument();
    expect(screen.getByTestId("how-it-works")).toBeInTheDocument();
    expect(screen.getByTestId("network-analytics")).toBeInTheDocument();
    expect(screen.getByTestId("quick-start")).toBeInTheDocument();
    expect(screen.getByTestId("download-options")).toBeInTheDocument();
  });

  test("renders components in correct order", () => {
    const { container } = render(<LandingPage />);
    const components = container.querySelectorAll("[data-testid]");

    expect(components[0]).toHaveAttribute("data-testid", "hero");
    expect(components[1]).toHaveAttribute("data-testid", "how-it-works");
    expect(components[2]).toHaveAttribute("data-testid", "network-analytics");
    expect(components[3]).toHaveAttribute("data-testid", "quick-start");
    expect(components[4]).toHaveAttribute("data-testid", "download-options");
  });

  test("renders without crashing", () => {
    const { container } = render(<LandingPage />);
    expect(container).toBeInTheDocument();
  });

  test("contains all expected sections", () => {
    render(<LandingPage />);

    const hero = screen.getByTestId("hero");
    const howItWorks = screen.getByTestId("how-it-works");
    const networkAnalytics = screen.getByTestId("network-analytics");
    const quickStart = screen.getByTestId("quick-start");
    const downloadOptions = screen.getByTestId("download-options");

    expect(hero).toHaveTextContent("Hero Component");
    expect(howItWorks).toHaveTextContent("How It Works Component");
    expect(networkAnalytics).toHaveTextContent("Network Analytics Component");
    expect(quickStart).toHaveTextContent("Quick Start Component");
    expect(downloadOptions).toHaveTextContent("Download Options Component");
  });
});
