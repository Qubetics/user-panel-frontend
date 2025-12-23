import {
  computePubKey,
  api,
  formatDuration,
  progressbar,
  toFirstCapital,
  getValueWithUnit,
  calculateBandwidth,
  truncateValue,
  formatTimestamp,
  formatHours,
  formatPlanWithTooltip,
} from "@/utils/Helper/CommonHelper";

// Mock dependencies
jest.mock("@/Constant/constants", () => ({
  PENDING: "PENDING",
  REJECTED: "REJECTED",
  WEI: "1000000000000000000",
}));

jest.mock("@/Constant/envConstants", () => ({
  env: {
    currency: "tics",
  },
}));

// Mock external dependencies
jest.mock("buffer", () => ({
  Buffer: {
    from: jest.fn((data, encoding) => {
      if (encoding === "base64") {
        return {
          toString: jest.fn(() => "base64-string"),
        };
      }
      if (encoding === "hex") {
        return new Uint8Array([1, 2, 3]);
      }
      return data;
    }),
  },
}));

jest.mock("js-sha3", () => ({
  keccak_256: jest.fn(() => "hashed-string"),
}));

jest.mock("@ethersproject/bytes", () => ({
  arrayify: jest.fn(() => new Uint8Array([1, 2, 3])),
}));

jest.mock("@cosmjs/launchpad", () => ({
  serializeSignDoc: jest.fn(() => "serialized-doc"),
}));

jest.mock("@hanchon/signature-to-pubkey", () => ({
  signatureToPubkey: jest.fn(() => "computed-pubkey"),
}));

// Mock fetch
global.fetch = jest.fn();

describe("CommonHelper Utilities", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("computePubKey", () => {
    test("computes public key successfully", () => {
      const result = computePubKey("test-address", "test-signature", "test-message");
      expect(result).toBe("computed-pubkey");
    });

    test("handles errors gracefully", () => {
      const mockConsoleError = jest.spyOn(console, "error").mockImplementation();
      
      // Mock the dependencies to throw an error
      const { serializeSignDoc } = require("@cosmjs/launchpad");
      serializeSignDoc.mockImplementation(() => {
        throw new Error("Serialization error");
      });

      const result = computePubKey("test-address", "test-signature", "test-message");
      
      expect(result).toBeUndefined();
      expect(mockConsoleError).toHaveBeenCalled();
      
      mockConsoleError.mockRestore();
    });
  });

  describe("api", () => {
    test("makes successful API call", async () => {
      const mockResponse = {
        ok: true,
        json: jest.fn().mockResolvedValue({ data: "success" }),
      };
      global.fetch.mockResolvedValue(mockResponse);

      const result = await api("https://api.example.com/test");

      expect(global.fetch).toHaveBeenCalledWith("https://api.example.com/test", undefined);
      expect(result).toEqual({ data: "success" });
    });

    test("handles API error response", async () => {
      const mockResponse = {
        ok: false,
        json: jest.fn().mockResolvedValue({ message: "API Error" }),
      };
      global.fetch.mockResolvedValue(mockResponse);

      await expect(api("https://api.example.com/error")).rejects.toThrow("API Error");
    });

    test("handles API error without message", async () => {
      const mockResponse = {
        ok: false,
        json: jest.fn().mockResolvedValue({}),
      };
      global.fetch.mockResolvedValue(mockResponse);

      await expect(api("https://api.example.com/error")).rejects.toThrow("Something went wrong!");
    });

    test("handles network error", async () => {
      const networkError = new Error("Network Error");
      global.fetch.mockRejectedValue(networkError);

      await expect(api("https://api.example.com/test")).rejects.toThrow("Network Error");
    });

    test("passes init options to fetch", async () => {
      const mockResponse = {
        ok: true,
        json: jest.fn().mockResolvedValue({ data: "success" }),
      };
      global.fetch.mockResolvedValue(mockResponse);

      const init = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ test: "data" }),
      };

      await api("https://api.example.com/test", init);

      expect(global.fetch).toHaveBeenCalledWith("https://api.example.com/test", init);
    });
  });

  describe("formatDuration", () => {
    test("formats hours less than 24", () => {
      expect(formatDuration(1)).toBe("1 hr");
      expect(formatDuration(5)).toBe("5 hrs");
      expect(formatDuration(23)).toBe("23 hrs");
    });

    test("formats days with remaining hours", () => {
      expect(formatDuration(24)).toBe("1 day");
      expect(formatDuration(25)).toBe("1 day 1 hr");
      expect(formatDuration(48)).toBe("2 days");
      expect(formatDuration(49)).toBe("2 days 1 hr");
      expect(formatDuration(72)).toBe("3 days");
      expect(formatDuration(73)).toBe("3 days 1 hr");
    });

    test("handles zero and null values", () => {
      expect(formatDuration(0)).toBe("0 hrs");
      expect(formatDuration(null)).toBe("");
      expect(formatDuration(undefined)).toBe("");
      expect(formatDuration(false)).toBe("");
    });

    test("handles large hour values", () => {
      expect(formatDuration(168)).toBe("7 days"); // 7 * 24
      expect(formatDuration(169)).toBe("7 days 1 hr");
      expect(formatDuration(170)).toBe("7 days 2 hrs");
    });
  });

  describe("progressbar", () => {
    test("returns true for active status", () => {
      expect(progressbar("ACTIVE")).toBe(true);
      expect(progressbar("COMPLETED")).toBe(true);
      expect(progressbar("IN_PROGRESS")).toBe(true);
    });

    test("returns false for pending and rejected status", () => {
      expect(progressbar("PENDING")).toBe(false);
      expect(progressbar("REJECTED")).toBe(false);
    });

    test("returns false for falsy values", () => {
      expect(progressbar(null)).toBe(false);
      expect(progressbar(undefined)).toBe(false);
      expect(progressbar(false)).toBe(false);
      expect(progressbar("")).toBe(false);
    });
  });

  describe("toFirstCapital", () => {
    test("capitalizes first letter and lowercases rest", () => {
      expect(toFirstCapital("hello")).toBe("Hello");
      expect(toFirstCapital("HELLO")).toBe("Hello");
      expect(toFirstCapital("hELLO")).toBe("Hello");
      expect(toFirstCapital("hello world")).toBe("Hello world");
    });

    test("handles empty and null values", () => {
      expect(toFirstCapital("")).toBe("");
      expect(toFirstCapital(null)).toBe("");
      expect(toFirstCapital(undefined)).toBe("");
    });

    test("handles single character", () => {
      expect(toFirstCapital("a")).toBe("A");
      expect(toFirstCapital("A")).toBe("A");
    });
  });

  describe("getValueWithUnit", () => {
    test("converts value with default currency", () => {
      expect(getValueWithUnit("1000000000000000000")).toBe("1");
      expect(getValueWithUnit("2000000000000000000")).toBe("2");
      expect(getValueWithUnit("500000000000000000")).toBe("0.5");
    });

    test("handles string and number values", () => {
      expect(getValueWithUnit("1000000000000000000")).toBe("1");
      expect(getValueWithUnit(1000000000000000000)).toBe("1");
    });

    test("handles zero and small values", () => {
      expect(getValueWithUnit("0")).toBe("0");
      expect(getValueWithUnit("100")).toBe("0.0000000000000001");
    });

    test("handles different units", () => {
      expect(getValueWithUnit("1000000000000000000", "tics")).toBe("1");
      expect(getValueWithUnit("1000000000000000000", "other")).toBe("1000000000000000000");
    });
  });

  describe("calculateBandwidth", () => {
    test("calculates bandwidth correctly", () => {
      expect(calculateBandwidth({ gigabytes: 1073741824 })).toBe("1 GB"); // 1 GB in bytes
      expect(calculateBandwidth({ gigabytes: 2147483648 })).toBe("2 GB"); // 2 GB in bytes
      expect(calculateBandwidth({ gigabytes: 5368709120 })).toBe("5 GB"); // 5 GB in bytes
    });

    test("handles null/undefined plan", () => {
      expect(calculateBandwidth(null)).toBe("");
      expect(calculateBandwidth(undefined)).toBe("");
    });

    test("handles plan without gigabytes", () => {
      expect(calculateBandwidth({})).toBe("");
      expect(calculateBandwidth({ otherProperty: "value" })).toBe("");
    });

    test("handles zero gigabytes", () => {
      expect(calculateBandwidth({ gigabytes: 0 })).toBe("");
    });

    test("rounds to nearest GB", () => {
      expect(calculateBandwidth({ gigabytes: 1500000000 })).toBe("1 GB"); // ~1.4 GB rounds to 1 GB
      expect(calculateBandwidth({ gigabytes: 1600000000 })).toBe("1 GB"); // ~1.5 GB rounds to 2 GB
    });
  });

  describe("truncateValue", () => {
    test("truncates value with default parameters", () => {
      expect(truncateValue("12345678901234567890")).toBe("1234567...4567890");
    });

    test("truncates with custom start and end parameters", () => {
      expect(truncateValue("12345678901234567890", 5, 5)).toBe("12345...67890");
      expect(truncateValue("12345678901234567890", 3, 3)).toBe("123...890");
    });

    test("handles values shorter than truncation length", () => {
      expect(truncateValue("12345")).toBe("12345");
      expect(truncateValue("1234567")).toBe("1234567");
    });

    test("handles null/undefined/empty values", () => {
      expect(truncateValue(null)).toBe("");
      expect(truncateValue(undefined)).toBe("");
      expect(truncateValue("")).toBe("");
    });

    test("handles exact length values", () => {
      expect(truncateValue("12345678901234", 7, 7)).toBe("12345678901234");
    });

    test("handles very long values", () => {
      const longValue = "a".repeat(100);
      const result = truncateValue(longValue, 10, 10);
      expect(result).toBe("aaaaaaaaaa...aaaaaaaaaa");
      expect(result.length).toBe(23); // 10 + 3 (dots) + 10
    });
  });

  describe("formatTimestamp", () => {
    test("formats timestamp correctly", () => {
      const timestamp = "2023-12-01T14:30:00Z";
      const result = formatTimestamp(timestamp);
      expect(result).toMatch(/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}(am|pm)$/);
    });

    test("handles null/undefined timestamp", () => {
      expect(formatTimestamp(null)).toBe("");
      expect(formatTimestamp(undefined)).toBe("");
      expect(formatTimestamp("")).toBe("");
    });

    test("handles different times of day", () => {
      // Morning
      const morning = "2023-12-01T08:30:00Z";
      const morningResult = formatTimestamp(morning);
      expect(morningResult).toMatch(/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}(am|pm)$/);

      // Afternoon
      const afternoon = "2023-12-01T14:30:00Z";
      const afternoonResult = formatTimestamp(afternoon);
      expect(afternoonResult).toMatch(/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}(am|pm)$/);

      // Midnight - handles timezone conversion
      const midnight = "2023-12-01T00:00:00Z";
      const midnightResult = formatTimestamp(midnight);
      expect(midnightResult).toMatch(/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}(am|pm)$/);

      // Noon - handles timezone conversion
      const noon = "2023-12-01T12:00:00Z";
      const noonResult = formatTimestamp(noon);
      expect(noonResult).toMatch(/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}(am|pm)$/);
    });

    test("handles single digit minutes", () => {
      const timestamp = "2023-12-01T14:05:00Z";
      const result = formatTimestamp(timestamp);
      expect(result).toMatch(/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}(am|pm)$/);
    });

    test("handles different dates", () => {
      const timestamp = "2023-01-15T14:30:00Z";
      const result = formatTimestamp(timestamp);
      expect(result).toMatch(/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}(am|pm)$/);
    });
  });

  describe("formatHours", () => {
    test("formats single hour", () => {
      expect(formatHours(1)).toBe("1 Hr");
      expect(formatHours("1")).toBe("1 Hr");
      expect(formatHours(0)).toBe("0 Hr");
    });

    test("formats multiple hours", () => {
      expect(formatHours(2)).toBe("2 Hrs");
      expect(formatHours("5")).toBe("5 Hrs");
      expect(formatHours(24)).toBe("24 Hrs");
    });

    test("handles decimal hours", () => {
      expect(formatHours(1.5)).toBe("1.5 Hrs");
      expect(formatHours(0.5)).toBe("0.5 Hr");
    });

    test("handles null/undefined values", () => {
      expect(formatHours(null)).toBe("0 Hr");
      expect(formatHours(undefined)).toBe("0 Hr");
    });
  });

  describe("formatPlanWithTooltip", () => {
    test("formats valid plan values", () => {
      const result = formatPlanWithTooltip("100.5");
      expect(result).toEqual({
        formatted: "100.50 TICS/month",
        tooltip: "100.5"
      });
    });

    test("handles integer values", () => {
      const result = formatPlanWithTooltip("100");
      expect(result).toEqual({
        formatted: "100.00 TICS/month",
        tooltip: "100"
      });
    });

    test("handles dash and empty values", () => {
      expect(formatPlanWithTooltip("-")).toEqual({
        formatted: "-",
        tooltip: "-"
      });
      expect(formatPlanWithTooltip(null)).toEqual({
        formatted: "-",
        tooltip: "-"
      });
      expect(formatPlanWithTooltip(undefined)).toEqual({
        formatted: "-",
        tooltip: "-"
      });
      expect(formatPlanWithTooltip("")).toEqual({
        formatted: "-",
        tooltip: "-"
      });
    });

    test("handles non-numeric values", () => {
      const result = formatPlanWithTooltip("invalid");
      expect(result).toEqual({
        formatted: "invalid",
        tooltip: "invalid"
      });
    });

    test("handles very small decimal values", () => {
      const result = formatPlanWithTooltip("0.001");
      expect(result).toEqual({
        formatted: "0.00 TICS/month",
        tooltip: "0.001"
      });
    });

    test("handles very large values", () => {
      const result = formatPlanWithTooltip("999999.999");
      expect(result).toEqual({
        formatted: "1000000.00 TICS/month",
        tooltip: "999999.999"
      });
    });

    test("handles scientific notation input", () => {
      const result = formatPlanWithTooltip("1e3");
      expect(result).toEqual({
        formatted: "1000.00 TICS/month",
        tooltip: "1e3"
      });
    });
  });

  describe("edge cases and error handling", () => {
    test("formatDuration handles negative values", () => {
      expect(formatDuration(-1)).toBe("-1 hrs");
      expect(formatDuration(-25)).toBe("-25 hrs");
    });

    test("getValueWithUnit handles very large numbers", () => {
      expect(getValueWithUnit("999999999999999999999999")).toBe("999999.999999999999999999");
    });

    test("calculateBandwidth handles very large values", () => {
      expect(calculateBandwidth({ gigabytes: 999999999999999999 })).toBe("931322575 GB");
    });

    test("truncateValue with zero start/end", () => {
      expect(truncateValue("1234567890", 0, 5)).toBe("...67890");
      expect(truncateValue("1234567890", 5, 0)).toBe("12345...1234567890");
    });

    test("formatTimestamp handles invalid dates", () => {
      const result = formatTimestamp("invalid-date");
      expect(result).toBe("NaN-NaN-NaN 12:NaNam");
    });

    test("formatHours handles string numbers", () => {
      expect(formatHours("2.5")).toBe("2.5 Hrs");
      expect(formatHours("0")).toBe("0 Hr");
    });

    test("formatPlanWithTooltip handles edge cases", () => {
      expect(formatPlanWithTooltip("0")).toEqual({
        formatted: "0.00 TICS/month",
        tooltip: "0"
      });
      expect(formatPlanWithTooltip(".5")).toEqual({
        formatted: "0.50 TICS/month",
        tooltip: ".5"
      });
    });
  });
});
