jest.mock("../src/assets/NodeImage1.svg", () => ({
  __esModule: true,
  default: "mock-node1.svg",
}));

jest.mock("../src/assets/NodeImage2.svg", () => ({
  __esModule: true,
  default: "mock-node2.svg",
}));

jest.mock("../src/assets/NodeImage3.svg", () => ({
  __esModule: true,
  default: "mock-node3.svg",
}));

import { render, screen } from "@testing-library/react";
import QuickStart from "../src/components/landingPage/QuickStart";

describe("QuickStart Component", () => {
  test("renders heading correctly", () => {
    render(<QuickStart />);
    expect(
      screen.getByRole("heading", { name: /Set Up Your Node in 3 Easy Steps/i })
    ).toBeInTheDocument();
  });

  test("renders all step titles", () => {
    render(<QuickStart />);

    expect(screen.getByText(/Setup Node/i)).toBeInTheDocument();
    expect(screen.getByText(/Deploy & Validate/i)).toBeInTheDocument();
    expect(screen.getByText(/Stake & Go Live/i)).toBeInTheDocument();
  });

  test("renders all step descriptions", () => {
    render(<QuickStart />);
    expect(screen.getByText(/Download the shell file/i)).toBeInTheDocument();
    expect(screen.getByText(/Run the deployment script/i)).toBeInTheDocument();
    expect(screen.getByText(/Once your node goes live/i)).toBeInTheDocument();
  });

});
