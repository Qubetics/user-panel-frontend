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

export const message = {
  app_store_coming: "Coming Soon",
};

export const WEI = new BigNumber(10 ** 18);

export const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const STATUS = {
  ACTIVE: "active",
};
