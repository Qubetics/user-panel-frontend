import { render, screen, fireEvent } from "@testing-library/react";
import React from "react";
import { NotificationModal } from "@/components/register/ResponseTabs";

// Mock ButtonCustom component
jest.mock("@/Common/ButtonCustom/ButtonCustom", () => {
  return function ButtonCustom({ label, onClick }) {
    return <button onClick={onClick}>{label}</button>;
  };
});

describe("NotificationModal Component", () => {
  const mockOnClose = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders when show is true", () => {
    render(<NotificationModal show={true} onClose={mockOnClose} />);

    expect(screen.getByText("Node Request")).toBeInTheDocument();
  });

  test("does not render when show is false", () => {
    const { container } = render(<NotificationModal show={false} onClose={mockOnClose} />);

    expect(container.firstChild).toBeNull();
  });

  test("renders with default title", () => {
    render(<NotificationModal show={true} onClose={mockOnClose} />);

    expect(screen.getByText("Node Request")).toBeInTheDocument();
  });

  test("renders with custom title", () => {
    render(<NotificationModal show={true} title="Custom Title" onClose={mockOnClose} />);

    expect(screen.getByText("Custom Title")).toBeInTheDocument();
  });

  test("renders with default empty message", () => {
    const { container } = render(<NotificationModal show={true} onClose={mockOnClose} />);

    const message = container.querySelector(".notification-modal__content__message");
    expect(message).toHaveTextContent("");
  });

  test("renders with custom message", () => {
    render(<NotificationModal show={true} message="Test message" onClose={mockOnClose} />);

    expect(screen.getByText("Test message")).toBeInTheDocument();
  });

  test("renders with default button label", () => {
    render(<NotificationModal show={true} onClose={mockOnClose} />);

    expect(screen.getByText("OK")).toBeInTheDocument();
  });

  test("renders with custom button label", () => {
    render(<NotificationModal show={true} buttonLabel="Close" onClose={mockOnClose} />);

    expect(screen.getByText("Close")).toBeInTheDocument();
  });

  test("calls onClose when close button is clicked", () => {
    render(<NotificationModal show={true} onClose={mockOnClose} />);

    const closeButton = screen.getByLabelText("Close modal");
    fireEvent.click(closeButton);

    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  test("calls onClose when OK button is clicked", () => {
    render(<NotificationModal show={true} onClose={mockOnClose} />);

    const okButton = screen.getByText("OK");
    fireEvent.click(okButton);

    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  test("renders close button with × symbol", () => {
    render(<NotificationModal show={true} onClose={mockOnClose} />);

    const closeButton = screen.getByLabelText("Close modal");
    expect(closeButton).toHaveTextContent("×");
  });

  test("renders with correct CSS classes", () => {
    const { container } = render(<NotificationModal show={true} onClose={mockOnClose} />);

    expect(container.querySelector(".notification-modal")).toBeInTheDocument();
    expect(container.querySelector(".notification-modal__content")).toBeInTheDocument();
    expect(container.querySelector(".notification-modal__close-btn")).toBeInTheDocument();
    expect(container.querySelector(".notification-modal__content__heading")).toBeInTheDocument();
    expect(container.querySelector(".notification-modal__content__message")).toBeInTheDocument();
    expect(container.querySelector(".notification-modal__actions")).toBeInTheDocument();
  });

  test("renders children when provided", () => {
    render(
      <NotificationModal show={true} onClose={mockOnClose}>
        <div data-testid="custom-child">Custom Child Content</div>
      </NotificationModal>
    );

    expect(screen.getByTestId("custom-child")).toBeInTheDocument();
    expect(screen.getByText("Custom Child Content")).toBeInTheDocument();
  });

  test("renders without children", () => {
    const { container } = render(<NotificationModal show={true} onClose={mockOnClose} />);

    expect(container.querySelector(".notification-modal__content")).toBeInTheDocument();
  });

  test("close button has correct type attribute", () => {
    render(<NotificationModal show={true} onClose={mockOnClose} />);

    const closeButton = screen.getByLabelText("Close modal");
    expect(closeButton).toHaveAttribute("type", "button");
  });

  test("renders with long message", () => {
    const longMessage = "This is a very long message that should still render correctly in the modal component without any issues.";
    render(<NotificationModal show={true} message={longMessage} onClose={mockOnClose} />);

    expect(screen.getByText(longMessage)).toBeInTheDocument();
  });

  test("renders with special characters in message", () => {
    const specialMessage = "Test & Message <> 123 !@#$%";
    render(<NotificationModal show={true} message={specialMessage} onClose={mockOnClose} />);

    expect(screen.getByText(specialMessage)).toBeInTheDocument();
  });

  test("renders with special characters in title", () => {
    const specialTitle = "Test & Title <> 123";
    render(<NotificationModal show={true} title={specialTitle} onClose={mockOnClose} />);

    expect(screen.getByText(specialTitle)).toBeInTheDocument();
  });

  test("handles multiple clicks on close button", () => {
    render(<NotificationModal show={true} onClose={mockOnClose} />);

    const closeButton = screen.getByLabelText("Close modal");
    fireEvent.click(closeButton);
    fireEvent.click(closeButton);
    fireEvent.click(closeButton);

    expect(mockOnClose).toHaveBeenCalledTimes(3);
  });

  test("handles multiple clicks on OK button", () => {
    render(<NotificationModal show={true} onClose={mockOnClose} />);

    const okButton = screen.getByText("OK");
    fireEvent.click(okButton);
    fireEvent.click(okButton);

    expect(mockOnClose).toHaveBeenCalledTimes(2);
  });

  test("renders all elements in correct structure", () => {
    const { container } = render(
      <NotificationModal show={true} title="Test" message="Message" onClose={mockOnClose}>
        <div>Child</div>
      </NotificationModal>
    );

    const modal = container.querySelector(".notification-modal");
    const content = container.querySelector(".notification-modal__content");
    const closeBtn = container.querySelector(".notification-modal__close-btn");
    const heading = container.querySelector(".notification-modal__content__heading");
    const message = container.querySelector(".notification-modal__content__message");
    const actions = container.querySelector(".notification-modal__actions");

    expect(modal).toContainElement(content);
    expect(content).toContainElement(closeBtn);
    expect(content).toContainElement(heading);
    expect(content).toContainElement(message);
    expect(content).toContainElement(actions);
  });

  test("renders with all props combined", () => {
    render(
      <NotificationModal
        show={true}
        title="Success"
        message="Operation completed successfully"
        buttonLabel="Done"
        onClose={mockOnClose}
      >
        <div data-testid="extra-content">Extra Content</div>
      </NotificationModal>
    );

    expect(screen.getByText("Success")).toBeInTheDocument();
    expect(screen.getByText("Operation completed successfully")).toBeInTheDocument();
    expect(screen.getByText("Done")).toBeInTheDocument();
    expect(screen.getByTestId("extra-content")).toBeInTheDocument();
  });

  test("does not call onClose on render", () => {
    render(<NotificationModal show={true} onClose={mockOnClose} />);

    expect(mockOnClose).not.toHaveBeenCalled();
  });

  test("heading element is h2", () => {
    const { container } = render(<NotificationModal show={true} title="Test" onClose={mockOnClose} />);

    const heading = container.querySelector("h2");
    expect(heading).toBeInTheDocument();
    expect(heading).toHaveTextContent("Test");
  });

  test("message element is paragraph", () => {
    const { container } = render(<NotificationModal show={true} message="Test" onClose={mockOnClose} />);

    const message = container.querySelector("p");
    expect(message).toBeInTheDocument();
    expect(message).toHaveTextContent("Test");
  });
});
