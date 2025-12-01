import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";

const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  useNavigate: () => mockNavigate,
}));

window.open = jest.fn();

jest.mock("@/Constant/envConstants", () => ({
  env: {
    provider_api: "https://provider-test.com",
  },
}));

const mockScrollIntoView = jest.fn();
document.getElementById = jest.fn(() => ({
  scrollIntoView: mockScrollIntoView,
}));

import Hero from "@/components/landingPage/Hero.jsx";

describe("Hero Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders heading correctly", () => {
    render(<Hero />);
    expect(
      screen.getByText("Power the New Internet: Become a")
    ).toBeInTheDocument();

    expect(screen.getByText("dVPN Node Today")).toBeInTheDocument();
  });

  it("navigates to /register when Become Node Operator clicked", () => {
    render(<Hero />);

    fireEvent.click(screen.getByText("Become Node Operator"));

    expect(mockNavigate).toHaveBeenCalledWith("/register");
  });

  it("opens provider link for Become Service Provider", () => {
    render(<Hero />);

    fireEvent.click(screen.getByText("Become Service Provider"));

    expect(window.open).toHaveBeenCalledWith(
      "https://provider-test.com",
      "_blank"
    );
  });

  it("scrolls into view when Download dVPN App clicked", () => {
    render(<Hero />);

    fireEvent.click(screen.getByText("Download dVPN App"));

    expect(document.getElementById).toHaveBeenCalledWith("download-section");
    expect(mockScrollIntoView).toHaveBeenCalledWith({
      behavior: "smooth",
    });
  });
});
