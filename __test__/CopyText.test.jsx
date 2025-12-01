import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import React from "react";
import CopyText from "@/Common/Copy/copyText";

// Mock the SvgIcon component
jest.mock("@/assets/SvgIcon/SvgIcon", () => ({
  NewCopyIcon: () => <div data-testid="copy-icon">Copy Icon</div>,
}));

// Mock antd Tooltip
jest.mock("antd", () => ({
  Tooltip: ({ children, title }) => (
    <div data-testid="tooltip" title={title}>
      {children}
    </div>
  ),
}));

// Mock CheckOutlined from antd icons
jest.mock("@ant-design/icons", () => ({
  CheckOutlined: () => <div data-testid="check-icon">Check Icon</div>,
}));

// Mock navigator.clipboard
Object.assign(navigator, {
  clipboard: {
    writeText: jest.fn(() => Promise.resolve()),
  },
});

describe("CopyText Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  test("renders with copy icon by default", () => {
    render(<CopyText text="test text" />);

    expect(screen.getByTestId("copy-icon")).toBeInTheDocument();
    expect(screen.queryByTestId("check-icon")).not.toBeInTheDocument();
  });

  test("copies text to clipboard when clicked", async () => {
    render(<CopyText text="test text to copy" />);

    const copyDiv = screen.getByTestId("copy-icon").parentElement.parentElement;
    fireEvent.click(copyDiv);

    expect(navigator.clipboard.writeText).toHaveBeenCalledWith("test text to copy");
  });

  test("shows check icon after copying", async () => {
    render(<CopyText text="test text" />);

    const copyDiv = screen.getByTestId("copy-icon").parentElement.parentElement;
    fireEvent.click(copyDiv);

    await waitFor(() => {
      expect(screen.getByTestId("check-icon")).toBeInTheDocument();
    });

    expect(screen.queryByTestId("copy-icon")).not.toBeInTheDocument();
  });

  test("reverts to copy icon after 1 second", async () => {
    render(<CopyText text="test text" />);

    const copyDiv = screen.getByTestId("copy-icon").parentElement.parentElement;
    fireEvent.click(copyDiv);

    await waitFor(() => {
      expect(screen.getByTestId("check-icon")).toBeInTheDocument();
    });

    // Fast-forward time by 1 second
    jest.advanceTimersByTime(1000);

    await waitFor(() => {
      expect(screen.getByTestId("copy-icon")).toBeInTheDocument();
    });

    expect(screen.queryByTestId("check-icon")).not.toBeInTheDocument();
  });

  test("renders with check icon when copy prop is true", () => {
    render(<CopyText text="test text" copy={true} />);

    expect(screen.getByTestId("check-icon")).toBeInTheDocument();
    expect(screen.queryByTestId("copy-icon")).not.toBeInTheDocument();
  });

  test("shows copy icon when copy prop is false", () => {
    render(<CopyText text="test text" copy={false} />);

    expect(screen.getByTestId("copy-icon")).toBeInTheDocument();
    expect(screen.queryByTestId("check-icon")).not.toBeInTheDocument();
  });

  test("updates when copy prop changes", async () => {
    const { rerender } = render(<CopyText text="test text" copy={false} />);

    expect(screen.getByTestId("copy-icon")).toBeInTheDocument();

    rerender(<CopyText text="test text" copy={true} />);

    await waitFor(() => {
      expect(screen.getByTestId("check-icon")).toBeInTheDocument();
    });
  });

  test("reverts to copy icon after 1 second when copy prop changes to true", async () => {
    const { rerender } = render(<CopyText text="test text" copy={false} />);

    rerender(<CopyText text="test text" copy={true} />);

    await waitFor(() => {
      expect(screen.getByTestId("check-icon")).toBeInTheDocument();
    });

    jest.advanceTimersByTime(1000);

    await waitFor(() => {
      expect(screen.getByTestId("copy-icon")).toBeInTheDocument();
    });
  });

  test("renders tooltip with correct title when not copied", () => {
    render(<CopyText text="test text" />);

    const tooltip = screen.getByTestId("tooltip");
    expect(tooltip).toHaveAttribute("title", "Copy");
  });

  test("renders tooltip with correct title when copied", async () => {
    render(<CopyText text="test text" />);

    const copyDiv = screen.getByTestId("copy-icon").parentElement.parentElement;
    fireEvent.click(copyDiv);

    await waitFor(() => {
      const tooltip = screen.getByTestId("tooltip");
      expect(tooltip).toHaveAttribute("title", " Copied");
    });
  });

  test("handles multiple clicks correctly", async () => {
    render(<CopyText text="test text" />);

    const copyDiv = screen.getByTestId("copy-icon").parentElement.parentElement;

    // First click
    fireEvent.click(copyDiv);
    await waitFor(() => {
      expect(screen.getByTestId("check-icon")).toBeInTheDocument();
    });

    jest.advanceTimersByTime(1000);

    await waitFor(() => {
      expect(screen.getByTestId("copy-icon")).toBeInTheDocument();
    });

    // Second click
    fireEvent.click(copyDiv);
    await waitFor(() => {
      expect(screen.getByTestId("check-icon")).toBeInTheDocument();
    });

    expect(navigator.clipboard.writeText).toHaveBeenCalledTimes(2);
  });

  test("handles empty text", () => {
    render(<CopyText text="" />);

    const copyDiv = screen.getByTestId("copy-icon").parentElement.parentElement;
    fireEvent.click(copyDiv);

    expect(navigator.clipboard.writeText).toHaveBeenCalledWith("");
  });

  test("handles special characters in text", () => {
    const specialText = "Test!@#$%^&*()_+-={}[]|\\:;\"'<>,.?/~`";
    render(<CopyText text={specialText} />);

    const copyDiv = screen.getByTestId("copy-icon").parentElement.parentElement;
    fireEvent.click(copyDiv);

    expect(navigator.clipboard.writeText).toHaveBeenCalledWith(specialText);
  });
});
