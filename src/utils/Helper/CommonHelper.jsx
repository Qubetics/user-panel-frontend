import { Buffer } from "buffer";
import sha3 from "js-sha3";
import { arrayify } from "@ethersproject/bytes";
import { serializeSignDoc } from "@cosmjs/launchpad";
import { signatureToPubkey } from "@hanchon/signature-to-pubkey";
import { PENDING, REJECTED, WEI } from "../../Constant/constants";
import { env } from "../../Constant/envConstants";
import BigNumber from "bignumber.js";

window.Buffer = Buffer;

function messageToAminoTransaction(signer, data) {
  return {
    chain_id: "",
    account_number: "0",
    sequence: "0",
    fee: {
      gas: "0",
      amount: [],
    },
    msgs: [
      {
        type: "sign/MsgSignData",
        value: {
          signer,
          data,
        },
      },
    ],
    memo: "",
  };
}

export const computePubKey = (address, signature, signMessage) => {
  try {
    // Encode the message into amino format
    const aminoEncoded = messageToAminoTransaction(address, Buffer.from(signMessage).toString("base64"));
    const serialized = serializeSignDoc(aminoEncoded);

    // Hash the amino message that was signed
    const hashed = sha3.keccak_256(arrayify(serialized));

    // Compare signature
    const signatureToCompare = `0x${Buffer.from(signature, "base64").toString("hex")}`;

    const pubkeyComputed = signatureToPubkey(signatureToCompare, Buffer.from(hashed, "hex"));
    return pubkeyComputed;
  } catch (err) {
    console.error("err", err);
  }
};

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

export const getValueWithUnit = (value, unit = env.currency) => {
  let unitBn;
  switch (unit) {
    case env.currency:
      unitBn = WEI;
      break;
    default:
      unitBn = new BigNumber(1);
  }

  const valueBn = new BigNumber(value);
  const valueCurr = valueBn.dividedBy(unitBn);
  const valueStr = valueCurr.toFixed();
  return valueStr;
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
