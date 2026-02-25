import React from "react";
import { render, screen } from "@testing-library/react";
import Footer from "@/components/Footer";

// Mock assets
jest.mock("@/assets/HeaderLogo.svg", () => "header-logo.svg");
jest.mock("@/assets/x.svg", () => "x.svg");
jest.mock("@/assets/Telegram.svg", () => "telegram.svg");
jest.mock("@/assets/Discord.svg", () => "discord.svg");
jest.mock("@/assets/YouTube.svg", () => "youtube.svg");
jest.mock("@/assets/Instagram.svg", () => "instagram.svg");
jest.mock("@/assets/TickTok.svg", () => "tiktok.svg");
jest.mock("@/assets/coinmarketcap.svg", () => "coinmarketcap.svg");

// Mock env constants
jest.mock("@/Constant/envConstants", () => ({
  env: {
    explorer_link: "https://explorer.qubetics.com",
    app_link: "https://app.qubetics.com",
    privacy_policy_link: "https://www.qubetics.com/privacy-policy",
    terms_of_service_link: "https://www.qubetics.com/terms-of-use",
    qubetics_validator_app_link: "https://validator.qubetics.com/",
    qubetics_delegator_app_link: "https://delegator.qubetics.com/",
    qubetics_ide_link: "https://ide.qubetics.com",
    qubeqode_link: "https://qubeqode.qubetics.com",
    web_link: "https://www.qubetics.com/",
    network_documentation_link: "https://docs.qubetics.com/",
    qubetics_documentation_link: "https://qubetics.gitbook.io/qubetics-docs",
    github_link: "https://github.com/Qubetics",
    x_link: "https://x.com/qubetics?mx=2",
    telegram_link: "https://t.me/qubetics",
    discord_link: "https://discord.com/invite/KHfSNbzdSE",
    youtube_link: "https://www.youtube.com/@Qubetics",
    instagram_link: "https://www.instagram.com/qubetics",
    tiktok_link: "https://www.tiktok.com/@qubetics",
    coinmarketcap_link: "https://coinmarketcap.com/currencies/qubetics/",
  },
}));

describe("Footer Component", () => {
  test("renders footer with all sections", () => {
    const { container } = render(<Footer />);

    // Check brand section
    const logo = container.querySelector(".footer__logo img");
    expect(logo).toBeInTheDocument();
    expect(screen.getByText(/Build without limits/)).toBeInTheDocument();
    expect(screen.getByText(/Qubetics an interoperable ecosystem/)).toBeInTheDocument();

    // Check section titles
    expect(screen.getByText("Quick Links")).toBeInTheDocument();
    expect(screen.getByText("About Us")).toBeInTheDocument();
    expect(screen.getByText("Products & Services")).toBeInTheDocument();
    expect(screen.getByText("Resources")).toBeInTheDocument();

    // Check social section
    expect(screen.getByText("Get in touch!")).toBeInTheDocument();

    // Check copyright
    expect(screen.getByText("©2025 Copyright Qubetics. All rights reserved.")).toBeInTheDocument();
  });

  test("renders all quick links with correct URLs", () => {
    render(<Footer />);

    const quickLinks = [
      { text: "Tokens", expectedUrl: "https://explorer.qubetics.com/token" },
      { text: "Blockchain", expectedUrl: "https://explorer.qubetics.com/blocks" },
      { text: "Validators", expectedUrl: "https://explorer.qubetics.com/validators" },
      { text: "Nodes", expectedUrl: "https://explorer.qubetics.com/nodes" },
    ];

    quickLinks.forEach(({ text, expectedUrl }) => {
      const link = screen.getByText(text);
      expect(link).toBeInTheDocument();
      expect(link.closest("a")).toHaveAttribute("href", expectedUrl);
      expect(link.closest("a")).toHaveAttribute("target", "_blank");
    });
  });

  test("renders all about us links", () => {
    render(<Footer />);

    const aboutLinks = [
      { text: "Privacy Policy", expectedUrl: "https://www.qubetics.com/privacy-policy" },
      { text: "Terms of Service", expectedUrl: "https://www.qubetics.com/terms-of-use" },
    ];

    aboutLinks.forEach(({ text, expectedUrl }) => {
      const link = screen.getByText(text);
      expect(link).toBeInTheDocument();
      expect(link.closest("a")).toHaveAttribute("href", expectedUrl);
      expect(link.closest("a")).toHaveAttribute("target", "_blank");
    });
  });

  test("renders all products and services links", () => {
    render(<Footer />);

    const productLinks = [
      { text: "Qubetics Validator App", expectedUrl: "https://validator.qubetics.com/" },
      { text: "Qubetics Delegator App", expectedUrl: "https://delegator.qubetics.com/" },
      { text: "Qubetics IDE", expectedUrl: "https://ide.qubetics.com" },
      { text: "QubeQode", expectedUrl: "https://qubeqode.qubetics.com" },
      { text: "Qubetics dVPN", expectedUrl: "https://app.qubetics.com" },
    ];

    productLinks.forEach(({ text, expectedUrl }) => {
      const link = screen.getByText(text);
      expect(link).toBeInTheDocument();
      expect(link.closest("a")).toHaveAttribute("href", expectedUrl);
      expect(link.closest("a")).toHaveAttribute("target", "_blank");
    });
  });

  test("renders all resource links", () => {
    render(<Footer />);

    const resourceLinks = [
      { text: "Official Web", expectedUrl: "https://www.qubetics.com/" },
      { text: "Qubetics Network Documentation", expectedUrl: "https://docs.qubetics.com/" },
      { text: "Qubetics Documentation", expectedUrl: "https://qubetics.gitbook.io/qubetics-docs" },
      { text: "GitHub", expectedUrl: "https://github.com/Qubetics" },
    ];

    resourceLinks.forEach(({ text, expectedUrl }) => {
      const link = screen.getByText(text);
      expect(link).toBeInTheDocument();
      expect(link.closest("a")).toHaveAttribute("href", expectedUrl);
      expect(link.closest("a")).toHaveAttribute("target", "_blank");
    });
  });

  test("renders all social media links", () => {
    const { container } = render(<Footer />);

    const socialLinks = [
      { expectedUrl: "https://x.com/qubetics?mx=2" },
      { expectedUrl: "https://t.me/qubetics" },
      { expectedUrl: "https://discord.com/invite/KHfSNbzdSE" },
      { expectedUrl: "https://www.youtube.com/@Qubetics" },
      { expectedUrl: "https://www.instagram.com/qubetics" },
      { expectedUrl: "https://www.tiktok.com/@qubetics" },
      { expectedUrl: "https://coinmarketcap.com/currencies/qubetics/" },
    ];

    const socialImages = container.querySelectorAll(".footer__social-link img");
    expect(socialImages.length).toBe(7); // 7 social media platforms

    socialLinks.forEach(({ expectedUrl }) => {
      const link = container.querySelector(`[href="${expectedUrl}"]`);
      expect(link).toBeInTheDocument();
      expect(link).toHaveAttribute("target", "_blank");
    });
  });

  test("has correct CSS classes and structure", () => {
    const { container } = render(<Footer />);

    expect(container.querySelector(".footer")).toBeInTheDocument();
    expect(container.querySelector(".footer__container")).toBeInTheDocument();
    expect(container.querySelector(".footer__content")).toBeInTheDocument();
    expect(container.querySelector(".footer__brand")).toBeInTheDocument();
    expect(container.querySelector(".footer__section")).toBeInTheDocument();
    expect(container.querySelector(".footer__social")).toBeInTheDocument();
    expect(container.querySelector(".footer__bottom")).toBeInTheDocument();
  });

  test("renders logo with correct attributes", () => {
    const { container } = render(<Footer />);

    const logo = container.querySelector(".footer__logo img");
    expect(logo).toBeInTheDocument();
    expect(logo).toHaveAttribute("src", "mock-file"); // Mocked value
    expect(logo).toHaveAttribute("alt", "");
  });

  test("all external links have target blank", () => {
    render(<Footer />);

    const externalLinks = screen.getAllByRole("link");
    externalLinks.forEach((link) => {
      if (link.getAttribute("href")?.startsWith("http")) {
        expect(link).toHaveAttribute("target", "_blank");
      }
    });
  });

  test("footer description text is complete", () => {
    render(<Footer />);

    const description = screen.getByText(/Build without limits/);
    expect(description).toBeInTheDocument();
    expect(description).toHaveTextContent(
      "Build without limits. Qubetics an interoperable ecosystem uniting all leading networks.",
    );
  });

  test("social section has correct heading", () => {
    render(<Footer />);

    const socialHeading = screen.getByText("Get in touch!");
    expect(socialHeading).toBeInTheDocument();
    expect(socialHeading.tagName).toBe("H4");
  });

  test("section titles are H5 elements", () => {
    render(<Footer />);

    const sectionTitles = screen.getAllByText(/Quick Links|About Us|Products & Services|Resources/);
    sectionTitles.forEach((title) => {
      expect(title.tagName).toBe("H5");
    });
  });

  test("footer links have correct CSS class", () => {
    const { container } = render(<Footer />);

    const links = container.querySelectorAll(".footer__link");
    expect(links.length).toBeGreaterThan(0);

    links.forEach((link) => {
      expect(link).toHaveClass("footer__link");
    });
  });

  test("social links have correct CSS class", () => {
    const { container } = render(<Footer />);

    const socialLinks = container.querySelectorAll(".footer__social-link");
    expect(socialLinks.length).toBe(7); // 7 social media platforms

    socialLinks.forEach((link) => {
      expect(link).toHaveClass("footer__social-link");
    });
  });
});
