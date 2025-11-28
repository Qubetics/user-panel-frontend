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

export const navTabs = [
  { label: "Request", path: "/register" },
  { label: "Request History", path: "/request-history" },
];

export const emailfrontendRegex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

export const nameRegex = /^(?!\s)[A-Za-z0-9_\s\-']+$/;

export const VALIDATION_MESSAGES = {
  NAME_MIN_LENGTH: "Name must be at least 3 characters",
  NAME_MAX_LENGTH: "Name cannot exceed 50 characters",
  NAME_INVALID:
    "Only letters, numbers, space, underscore, hyphen, and ' are allowed",
};
