import BigNumber from "bignumber.js";

export const apiMethods = {
  GET: "get",
  POST: "post",
  PUT: "put",
  DELETE: "delete",
};

export const APPROVED = "APPROVED";
export const PENDING = "PENDING";
export const REJECTED = "REJECTED";
export const REQUEST_TYPE = {
  LINK: "Link",
  UNLINK: "Unlink",
};

export const NODE_REQUEST = "Node request sent successfully!";
export const NODE_FAILED = "Node request failed!";

export const WEI = new BigNumber(10 ** 18);

export const STATUS = {
  ACTIVE: "active",
};

export const navTabs = [
  { label: "Request", path: "/register" },
  { label: "Request History", path: "/request-history" },
];

export const emailfrontendRegex =
  /^(?!.*\s)(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}))$/;
