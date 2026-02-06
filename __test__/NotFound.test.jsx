import { render, screen, fireEvent } from "@testing-library/react";
import NotFound from "@/components/NotFound/index.jsx";
import { useNavigate } from "react-router-dom";

// Mock react-router-dom
jest.mock("react-router-dom", () => ({
  useNavigate: jest.fn(),
}));

// Mock ButtonCustom component
jest.mock("@/Common/ButtonCustom/ButtonCustom", () => (props) => (
  <button onClick={props.onClick}>{props.label}</button>
));

describe("NotFound Component", () => {
  let mockNavigate;

  beforeEach(() => {
    mockNavigate = jest.fn();
    useNavigate.mockReturnValue(mockNavigate);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("renders 404 page with correct content", () => {
    render(<NotFound />);

    expect(screen.getByText("404")).toBeInTheDocument();
    expect(screen.getByText("Page Not Found")).toBeInTheDocument();
    expect(screen.getByText(/Oops! The page you're looking for doesn't exist/i)).toBeInTheDocument();
    expect(screen.getByText("Back to Home")).toBeInTheDocument();
  });

  test("renders Back to Home button", () => {
    render(<NotFound />);

    const button = screen.getByText("Back to Home");
    expect(button).toBeInTheDocument();
  });

  test("navigates to home page when Back to Home button is clicked", () => {
    render(<NotFound />);

    const button = screen.getByText("Back to Home");
    fireEvent.click(button);

    expect(mockNavigate).toHaveBeenCalledTimes(1);
    expect(mockNavigate).toHaveBeenCalledWith("/");
  });

  test("renders decorative elements", () => {
    const { container } = render(<NotFound />);

    const decorations = container.querySelectorAll(".notFound__decoration");
    expect(decorations).toHaveLength(2);
  });

  test("renders with correct CSS classes", () => {
    const { container } = render(<NotFound />);

    expect(container.querySelector(".notFound")).toBeInTheDocument();
    expect(container.querySelector(".notFound__container")).toBeInTheDocument();
    expect(container.querySelector(".notFound__code")).toBeInTheDocument();
    expect(container.querySelector(".notFound__title")).toBeInTheDocument();
    expect(container.querySelector(".notFound__description")).toBeInTheDocument();
    expect(container.querySelector(".notFound__buttonWrapper")).toBeInTheDocument();
  });
});
