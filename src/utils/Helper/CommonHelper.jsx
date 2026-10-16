import { Buffer } from "buffer";
import { PENDING, REJECTED, WEI } from "../../Constant/constants";
import { env } from "../../Constant/envConstants";
import BigNumber from "bignumber.js";

window.Buffer = Buffer;

export const api = async (url, init) => {
  return fetch(url, init)
    .then(async (response) => {
      const data = await response.json();

      if (!response.ok) {
        const errorMessage = data?.message || "Something went wrong!";
        throw new Error(errorMessage);
      }

      return data;
    })
    .catch((error) => {
      throw error;
    });
};

export const formatDuration = (hours) => {
  if (!hours && hours !== 0) return "";

  if (hours >= 24) {
    const days = Math.floor(hours / 24);
    const remainingHours = hours % 24;

    const dayLabel = days === 1 ? "day" : "days";
    const hourLabel = remainingHours === 1 ? "hr" : "hrs";

    if (remainingHours > 0) {
      return `${days} ${dayLabel} ${remainingHours} ${hourLabel}`;
    } else {
      return `${days} ${dayLabel}`;
    }
  } else {
    const hourLabel = hours === 1 ? "hr" : "hrs";
    return `${hours} ${hourLabel}`;
  }
};

export const progressbar = (status) => {
  if (!status) return false;
  if (status === PENDING || status === REJECTED) return false;
  return true;
};

export const toFirstCapital = (str) => {
  if (!str) return "";
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

export const getValueWithUnit = (value, hours, unit = env.currency) => {
  let unitBn;
  switch (unit) {
    case env.currency:
      unitBn = WEI;
      break;
    default:
      unitBn = new BigNumber(1);
  }

  const hoursNum = Number(hours) || 720;
  let valueBn = new BigNumber(value);
  valueBn = valueBn.dividedBy(hoursNum / 720);
  const valueCurr = valueBn.dividedBy(unitBn);
  const valueStr = valueCurr.toFixed();
  return valueStr;
};

export const getPlanLabel = (plan, tokenPrice) => {
  if (!plan?.prices?.length) return `Plan ${plan.id}`;

  const priceObj = plan.prices[0];
  const ticsValue = getValueWithUnit(priceObj.quote_value, plan.hours);
  const denom = priceObj.denom.toUpperCase();

  let usdString = "";
  if (tokenPrice) {
    const usdValue = (parseFloat(ticsValue) * parseFloat(tokenPrice)).toFixed(4);
    if (!isNaN(usdValue)) {
      usdString = `$${usdValue}`;
    }
  }

  if (usdString) {
    return ` ${usdString}/month (${ticsValue} ${denom})`;
  }

  return `${ticsValue} ${denom}/month`;
};

export const calculateBandwidth = (plan) => {
  if (!plan?.gigabytes) return "";
  const gb = Math.round(plan.gigabytes / (1024 * 1024 * 1024));
  return `${gb} GB`;
};

export const truncateValue = (value, start = 7, end = 7) => {
  if (!value) return "";
  if (value.length <= start + end) return value;
  return `${value.slice(0, start)}...${value.slice(-end)}`;
};

export const formatTimestamp = (timestamp) => {
  if (!timestamp) return "";
  const date = new Date(timestamp);

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  let hours = date.getHours();
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const ampm = hours >= 12 ? "pm" : "am";

  hours = hours % 12 || 12;

  return `${year}-${month}-${day} ${String(hours).padStart(2, "0")}:${minutes}${ampm}`;
};

export const formatHours = (hours) => {
  const value = Number(hours ?? 0);
  return value > 1 ? `${value} Hrs` : `${value} Hr`;
};

export const formatPlanWithTooltip = (planRaw, tokenPrice) => {
  if (!planRaw || planRaw === "-") {
    return {
      formatted: "-",
      tooltip: "-",
    };
  }

  // Parse the numeric amount. Supports bare numbers ("100.5", "1e3", ".5")
  // as well as "<amount> <TOKEN>" strings ("100 TICS").
  const numberValue = parseFloat(planRaw);

  if (isNaN(numberValue)) {
    return {
      formatted: planRaw,
      tooltip: planRaw,
    };
  }

  // Use an explicit trailing token if the string ends in letters (e.g. "100 TICS"),
  // otherwise default to TICS. A trailing digit (e.g. "1e3") has no token.
  const tokenMatch = String(planRaw).match(/[A-Za-z]+$/);
  const token = tokenMatch ? tokenMatch[0] : "TICS";

  const formattedValue = numberValue.toFixed(2);

  let formattedPrice = `${formattedValue} ${token}/month`;

  // If token price exists → show USD + token
  if (tokenPrice) {
    const usdValue = (numberValue * tokenPrice).toFixed(2);
    formattedPrice = `$${usdValue}/month (${formattedValue} ${token})`;
  }

  return {
    formatted: formattedPrice,
    tooltip: planRaw,
  };
};
