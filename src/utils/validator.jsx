import { emailfrontendRegex } from "../Constant/constants";

export const validateEmail = (value) => {
  let error = "";
  let cleaned = value;

  if (/\s/.test(value)) {
    error = "Spaces are not allowed";
  } else if (/[^a-zA-Z0-9@_\-.|]/.test(value)) {
    error = "Special characters are not allowed";
  }

  cleaned = cleaned.replace(/\s/g, "");
  cleaned = cleaned.replace(/[^a-zA-Z0-9@_\-.|]/g, "");

  if (!error) {
    if (cleaned && !emailfrontendRegex.test(cleaned)) {
      error = "Invalid email format";
    }
  }

  return { cleaned, error, isValid: !error && cleaned };
};

export const validateName = (value) => {
  let error = "";

  const nameRegex = /^(?!\s)(?!.*\s$)(?!.*\s{2,})[\p{L}\p{M}\p{N}' .-]+$/u;

  value = value.replace(/^\s+/g, "");

  let cleaned = value.replace(/[^\p{L}\p{M}\p{N}' .-]/gu, "");

  if (value && !nameRegex.test(value)) {
    error = "Only letters, numbers, single spaces are allowed.";
  } else if (/\s$/.test(value)) {
    error = "Name cannot end with a space.";
  } else if (/\s{2,}/.test(value)) {
    error = "Consecutive spaces are not allowed.";
  } else if (cleaned.length > 0 && cleaned.length < 3) {
    error = "Name must be at least 3 characters long.";
  } else if (cleaned.length > 50) {
    error = "Name cannot exceed 50 characters.";
  }

  cleaned = cleaned.replace(/\s{2,}/g, " ");

  return { cleaned, error, isValid: !error };
};

export const validateNodeAddress = (value) => {
  const cleaned = value.replace(/[^a-zA-Z0-9]/g, "");
  let error = "";

  if (/[^a-zA-Z0-9]/.test(value)) {
    error = "Only letters and numbers are allowed.";
  } else if (cleaned.length > 0 && cleaned.length < 50) {
    error = "Node address should not be less than 50.";
  }

  return { cleaned, error, isValid: !error };
};
