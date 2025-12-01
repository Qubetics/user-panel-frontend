import { render, screen } from "@testing-library/react";
import React from "react";
import StatCard from "@/Common/StatCard/StatCard";

describe("StatCard Component", () => {
  test("renders with all props", () => {
    const icon = <div data-testid="test-icon">Icon</div>;
    render(<StatCard icon={icon} label="Test Label" value="Test Value" />);

    expect(screen.getByTestId("test-icon")).toBeInTheDocument();
    expect(screen.getByText("Test Label")).toBeInTheDocument();
    expect(screen.getByText("Test Value")).toBeInTheDocument();
  });

  test("renders with correct structure", () => {
    const icon = <div data-testid="test-icon">Icon</div>;
    const { container } = render(<StatCard icon={icon} label="Test Label" value="Test Value" />);

    const statCard = container.querySelector(".stat-card");
    expect(statCard).toBeInTheDocument();

    const iconDiv = container.querySelector(".icon");
    expect(iconDiv).toBeInTheDocument();

    const rightDiv = container.querySelector(".stat-card-right");
    expect(rightDiv).toBeInTheDocument();
  });

  test("renders label with correct class", () => {
    const icon = <div>Icon</div>;
    const { container } = render(<StatCard icon={icon} label="Test Label" value="Test Value" />);

    const label = container.querySelector(".label");
    expect(label).toBeInTheDocument();
    expect(label).toHaveTextContent("Test Label");
  });

  test("renders value with correct class", () => {
    const icon = <div>Icon</div>;
    const { container } = render(<StatCard icon={icon} label="Test Label" value="Test Value" />);

    const value = container.querySelector(".value");
    expect(value).toBeInTheDocument();
    expect(value).toHaveTextContent("Test Value");
  });

  test("renders with numeric value", () => {
    const icon = <div>Icon</div>;
    render(<StatCard icon={icon} label="Count" value={123} />);

    expect(screen.getByText("Count")).toBeInTheDocument();
    expect(screen.getByText("123")).toBeInTheDocument();
  });

  test("renders with string value", () => {
    const icon = <div>Icon</div>;
    render(<StatCard icon={icon} label="Status" value="Active" />);

    expect(screen.getByText("Status")).toBeInTheDocument();
    expect(screen.getByText("Active")).toBeInTheDocument();
  });

  test("renders with complex icon", () => {
    const complexIcon = (
      <svg data-testid="complex-icon">
        <circle cx="10" cy="10" r="5" />
      </svg>
    );
    render(<StatCard icon={complexIcon} label="Test" value="Value" />);

    expect(screen.getByTestId("complex-icon")).toBeInTheDocument();
  });

  test("renders with empty string label", () => {
    const icon = <div>Icon</div>;
    render(<StatCard icon={icon} label="" value="Test Value" />);

    const { container } = render(<StatCard icon={icon} label="" value="Test Value" />);
    const label = container.querySelector(".label");
    expect(label).toHaveTextContent("");
  });

  test("renders with empty string value", () => {
    const icon = <div>Icon</div>;
    const { container } = render(<StatCard icon={icon} label="Test Label" value="" />);

    const value = container.querySelector(".value");
    expect(value).toHaveTextContent("");
  });

  test("renders with long label text", () => {
    const icon = <div>Icon</div>;
    const longLabel = "This is a very long label text that might wrap to multiple lines";
    render(<StatCard icon={icon} label={longLabel} value="Value" />);

    expect(screen.getByText(longLabel)).toBeInTheDocument();
  });

  test("renders with long value text", () => {
    const icon = <div>Icon</div>;
    const longValue = "This is a very long value text that might wrap to multiple lines";
    render(<StatCard icon={icon} label="Label" value={longValue} />);

    expect(screen.getByText(longValue)).toBeInTheDocument();
  });

  test("renders with special characters in label", () => {
    const icon = <div>Icon</div>;
    const specialLabel = "Test & Label <> 123";
    render(<StatCard icon={icon} label={specialLabel} value="Value" />);

    expect(screen.getByText(specialLabel)).toBeInTheDocument();
  });

  test("renders with special characters in value", () => {
    const icon = <div>Icon</div>;
    const specialValue = "Value & Test <> 456";
    render(<StatCard icon={icon} label="Label" value={specialValue} />);

    expect(screen.getByText(specialValue)).toBeInTheDocument();
  });

  test("renders icon inside icon div", () => {
    const icon = <span data-testid="icon-span">Icon Content</span>;
    const { container } = render(<StatCard icon={icon} label="Label" value="Value" />);

    const iconDiv = container.querySelector(".icon");
    const iconSpan = screen.getByTestId("icon-span");

    expect(iconDiv).toContainElement(iconSpan);
  });

  test("renders label and value inside stat-card-right", () => {
    const icon = <div>Icon</div>;
    const { container } = render(<StatCard icon={icon} label="Test Label" value="Test Value" />);

    const rightDiv = container.querySelector(".stat-card-right");
    const label = container.querySelector(".label");
    const value = container.querySelector(".value");

    expect(rightDiv).toContainElement(label);
    expect(rightDiv).toContainElement(value);
  });

  test("renders with zero as value", () => {
    const icon = <div>Icon</div>;
    render(<StatCard icon={icon} label="Count" value={0} />);

    expect(screen.getByText("0")).toBeInTheDocument();
  });

  test("renders with negative number as value", () => {
    const icon = <div>Icon</div>;
    render(<StatCard icon={icon} label="Balance" value={-100} />);

    expect(screen.getByText("-100")).toBeInTheDocument();
  });

  test("renders with decimal number as value", () => {
    const icon = <div>Icon</div>;
    render(<StatCard icon={icon} label="Price" value={99.99} />);

    expect(screen.getByText("99.99")).toBeInTheDocument();
  });

  test("renders without crashing when all props provided", () => {
    const icon = <div>Icon</div>;
    const { container } = render(<StatCard icon={icon} label="Label" value="Value" />);

    expect(container.firstChild).toBeInTheDocument();
  });
});
