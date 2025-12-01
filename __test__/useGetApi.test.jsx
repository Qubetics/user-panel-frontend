import useGetApi from "@/Hooks/useGetApi";
import axios from "axios";
import { apiMethods } from "@/Constant/constants";
import { env } from "@/Constant/envConstants";

// Mock axios
jest.mock("axios");
const mockedAxios = axios;

// Mock constants
jest.mock("@/Constant/constants", () => ({
  apiMethods: {
    GET: "get",
    POST: "post",
    PUT: "put",
    DELETE: "delete",
  },
}));

jest.mock("@/Constant/envConstants", () => ({
  env: {
    baseApiUrls: "https://api.qubetics.com",
  },
}));

describe("useGetApi Hook", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("makes successful GET request", async () => {
    const mockResponse = {
      data: { message: "Success", data: { id: 1, name: "Test" } },
      headers: { total: "10" },
    };
    mockedAxios.mockResolvedValue(mockResponse);

    const result = await useGetApi("/test-endpoint", apiMethods.GET);

    expect(mockedAxios).toHaveBeenCalledWith({
      method: "get",
      url: "https://api.qubetics.com/test-endpoint",
      data: undefined,
      withCredentials: true,
      headers: undefined,
    });

    expect(result).toEqual({
      success: true,
      data: { message: "Success", data: { id: 1, name: "Test" } },
      headers: { totalCount: "10" },
      message: "Success",
    });
  });

  test("makes successful POST request with body", async () => {
    const mockResponse = {
      data: { message: "Created", data: { id: 2, name: "New Item" } },
      headers: {},
    };
    const requestBody = { name: "New Item", type: "test" };
    mockedAxios.mockResolvedValue(mockResponse);

    const result = await useGetApi("/create-endpoint", apiMethods.POST, requestBody);

    expect(mockedAxios).toHaveBeenCalledWith({
      method: "post",
      url: "https://api.qubetics.com/create-endpoint",
      data: requestBody,
      withCredentials: true,
      headers: undefined,
    });

    expect(result).toEqual({
      success: true,
      data: { message: "Created", data: { id: 2, name: "New Item" } },
      headers: { totalCount: undefined },
      message: "Created",
    });
  });

  test("handles request with additional headers", async () => {
    const mockResponse = {
      data: { message: "Success" },
      headers: {},
    };
    const additionalHeaders = {
      "Content-Type": "application/json",
      Authorization: "Bearer token123",
    };
    mockedAxios.mockResolvedValue(mockResponse);

    await useGetApi("/secure-endpoint", apiMethods.GET, null, additionalHeaders);

    expect(mockedAxios).toHaveBeenCalledWith({
      method: "get",
      url: "https://api.qubetics.com/secure-endpoint",
      data: undefined,
      withCredentials: true,
      headers: additionalHeaders,
    });
  });

  test("handles IPFS request (without credentials)", async () => {
    const mockResponse = {
      data: { message: "IPFS Success" },
      headers: {},
    };
    mockedAxios.mockResolvedValue(mockResponse);

    await useGetApi("/ipfs-endpoint", apiMethods.POST, { data: "test" }, {}, true);

    expect(mockedAxios).toHaveBeenCalledWith({
      method: "post",
      url: "https://api.qubetics.com/ipfs-endpoint",
      data: { data: "test" },
      withCredentials: false, // IPFS requests don't use credentials
      headers: {},
    });
  });

  test("handles network error", async () => {
    const networkError = new Error("Network Error");
    mockedAxios.mockRejectedValue(networkError);

    const result = await useGetApi("/test-endpoint", apiMethods.GET);

    expect(result).toEqual({
      success: false,
      message: "Network Error",
    });
  });

  test("handles API error response", async () => {
    const apiError = {
      response: {
        data: { message: "API Error Message" },
      },
    };
    mockedAxios.mockRejectedValue(apiError);

    const result = await useGetApi("/test-endpoint", apiMethods.GET);

    expect(result).toEqual({
      success: false,
      message: "API Error Message",
    });
  });

  test("handles API error without message", async () => {
    const apiError = {
      response: {
        data: {},
      },
    };
    mockedAxios.mockRejectedValue(apiError);

    const result = await useGetApi("/test-endpoint", apiMethods.GET);

    expect(result).toEqual({
      success: false,
      message: undefined,
    });
  });

  test("handles error without response", async () => {
    const error = new Error("Custom error");
    delete error.response;
    mockedAxios.mockRejectedValue(error);

    const result = await useGetApi("/test-endpoint", apiMethods.GET);

    expect(result).toEqual({
      success: false,
      message: "Custom error",
    });
  });

  test("defaults to GET method when no method provided", async () => {
    const mockResponse = {
      data: { message: "Success" },
      headers: {},
    };
    mockedAxios.mockResolvedValue(mockResponse);

    await useGetApi("/default-endpoint");

    expect(mockedAxios).toHaveBeenCalledWith({
      method: "get", // Defaults to GET
      url: "https://api.qubetics.com/default-endpoint",
      data: undefined,
      withCredentials: true,
      headers: undefined,
    });
  });

  test("handles PUT request", async () => {
    const mockResponse = {
      data: { message: "Updated" },
      headers: {},
    };
    mockedAxios.mockResolvedValue(mockResponse);

    await useGetApi("/update-endpoint", apiMethods.PUT, { id: 1, name: "Updated" });

    expect(mockedAxios).toHaveBeenCalledWith({
      method: "put",
      url: "https://api.qubetics.com/update-endpoint",
      data: { id: 1, name: "Updated" },
      withCredentials: true,
      headers: undefined,
    });
  });

  test("handles DELETE request", async () => {
    const mockResponse = {
      data: { message: "Deleted" },
      headers: {},
    };
    mockedAxios.mockResolvedValue(mockResponse);

    await useGetApi("/delete-endpoint", apiMethods.DELETE);

    expect(mockedAxios).toHaveBeenCalledWith({
      method: "delete",
      url: "https://api.qubetics.com/delete-endpoint",
      data: undefined,
      withCredentials: true,
      headers: undefined,
    });
  });

  test("handles empty response data", async () => {
    const mockResponse = {
      data: {},
      headers: {},
    };
    mockedAxios.mockResolvedValue(mockResponse);

    const result = await useGetApi("/empty-endpoint", apiMethods.GET);

    expect(result).toEqual({
      success: true,
      data: {},
      headers: { totalCount: undefined },
      message: "Success",
    });
  });

  test("handles response without headers", async () => {
    const mockResponse = {
      data: { message: "Success" },
    };
    delete mockResponse.headers;
    mockedAxios.mockResolvedValue(mockResponse);

    const result = await useGetApi("/no-headers-endpoint", apiMethods.GET);

    expect(result).toEqual({
      success: false,
      message: "Cannot read properties of undefined (reading 'total')",
    });
  });

  test("handles response with custom message", async () => {
    const mockResponse = {
      data: { message: "Custom Success Message" },
      headers: {},
    };
    mockedAxios.mockResolvedValue(mockResponse);

    const result = await useGetApi("/custom-message-endpoint", apiMethods.GET);

    expect(result.message).toBe("Custom Success Message");
  });

  test("handles null/undefined body", async () => {
    const mockResponse = {
      data: { message: "Success" },
      headers: {},
    };
    mockedAxios.mockResolvedValue(mockResponse);

    await useGetApi("/test-endpoint", apiMethods.POST, null);
    await useGetApi("/test-endpoint2", apiMethods.POST, undefined);

    expect(mockedAxios).toHaveBeenNthCalledWith(1, {
      method: "post",
      url: "https://api.qubetics.com/test-endpoint",
      data: undefined, // null becomes undefined
      withCredentials: true,
      headers: undefined,
    });

    expect(mockedAxios).toHaveBeenNthCalledWith(2, {
      method: "post",
      url: "https://api.qubetics.com/test-endpoint2",
      data: undefined, // undefined stays undefined
      withCredentials: true,
      headers: undefined,
    });
  });

  test("constructs correct URL with base API URL", async () => {
    const mockResponse = {
      data: { message: "Success" },
      headers: {},
    };
    mockedAxios.mockResolvedValue(mockResponse);

    await useGetApi("/api/v1/users");

    expect(mockedAxios).toHaveBeenCalledWith({
      method: "get",
      url: "https://api.qubetics.com/api/v1/users",
      data: undefined,
      withCredentials: true,
      headers: undefined,
    });
  });
});
