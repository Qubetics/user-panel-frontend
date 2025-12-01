import React from "react";
import { render, screen } from "@testing-library/react";
import HowItWorks from "@/components/landingPage/HowItWorks";

jest.mock("@/styles/components/landingPage/how-it-works.scss", () => ({}));

jest.mock("@/assets/downloanIcon.svg", () => "mock-file");
jest.mock("@/assets/connectIcon.svg", () => "mock-file");
jest.mock("@/assets/browseIcon.svg", () => "mock-file");

describe("HowItWorks Component", () => {
  test("renders main heading", () => {
    render(<HowItWorks />);
    expect(screen.getByText("How dVPN Works")).toBeInTheDocument();
  });

  test("renders all steps titles", () => {
    render(<HowItWorks />);

    expect(screen.getByText("Download the Wallet App")).toBeInTheDocument();
    expect(screen.getByText("Connect to a Node")).toBeInTheDocument();

    expect(
      screen.getByText((text) => text.trim() === "Browse Anonymously")
    ).toBeInTheDocument();
  });

  test("renders all step descriptions", () => {
    render(<HowItWorks />);

    expect(
      screen.getByText("Get the Qubetics Wallet App and install it in seconds")
    ).toBeInTheDocument();

    expect(
      screen.getByText(
        "Launch the app, choose a secure node from the global network, and connect"
      )
    ).toBeInTheDocument();

    expect(
      screen.getByText(
        "You’re now protected — surf the web with privacy, freedom, and no restrictions"
      )
    ).toBeInTheDocument();
  });

  test("renders icons correctly", () => {
    render(<HowItWorks />);

    const images = screen.getAllByAltText("work-icon");
    expect(images.length).toBe(3);

    expect(images[0]).toHaveAttribute("src", "mock-file");
    expect(images[1]).toHaveAttribute("src", "mock-file");
    expect(images[2]).toHaveAttribute("src", "mock-file");
  });
});
