import BigNumber from "bignumber.js";

export const apiMethods = {
  GET: "get",
  POST: "post",
  PUT: "put",
  DELETE: "delete",
};

export const PENDING = "PENDING";
export const REJECTED = "REJECTED";

export const NODE_REQUEST = "Node request sent successfully!";
export const NODE_FAILED = "Node request failed!";

export const message = {
  app_store_coming: "Coming Soon",
};

export const WEI = new BigNumber(10 ** 18);

export const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const STATUS = {
  ACTIVE: "active",
};

export const navTabs = [
  { label: "Request", path: "/register" },
  { label: "Request History", path: "/request-history" },
];
