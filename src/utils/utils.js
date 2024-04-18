import { useMediaQuery } from "@mui/material";
import { format as formatDateFn } from "date-fns";
import { ethers } from 'ethers';
import { DEFAULT_REFERRAL_ADDR } from "./constants";
import Web3 from 'web3';

export const IsMobile = () => {
  return useMediaQuery('(max-width:1023px)');
}

export const makeShort = (text, len = 5) => {
  return text.substring(0, len) + "..." + text.substring(text.length - len, text.length)
}

export const copyToClipboard = (data) => {
  if (navigator.clipboard && window.isSecureContext) {
    // navigator clipboard api method'
    return navigator.clipboard.writeText(data);
  } else {
    var textField = document.createElement('textarea')
    textField.innerText = data;
    textField.style.position = "fixed";
    textField.style.left = "-999999px";
    textField.style.top = "-999999px";
    document.body.appendChild(textField)
    textField.select()
    document.execCommand('copy')
    textField.remove()
  }
}

export const isEmpty = (value) =>
  value === undefined ||
  value === null ||
  (typeof value === "object" && Object.keys(value).length === 0) ||
  (typeof value === "string" && value.trim().length === 0);

export function fromWei(amount, decimal = 18) {
  amount = ethers.utils.formatUnits(amount, decimal)
  if (typeof amount === 'string') {
    amount = Number(amount)
  }
  return isNaN(amount) ? 0 : amount
}

export function toWei(amount, decimal = 18) {
  return Web3.utils.toWei(amount, "ether");
}

export function float2int(value) {
  return parseInt(value.toFixed(0));
}

export function parseDecimalFloat(value, count = 3) {
  return parseFloat(value.toFixed(count));
}

export const numberWithCommas = (x, digits = 3) => {
  if (isEmpty(x)) return '0';
  return Number(x).toLocaleString(undefined, { maximumFractionDigits: digits });
}

export const parseNumber = (n, digits = 3) => {
  if (isNaN(n)) return 0;
  return parseInt((n * 10 ** digits).toString()) / 10 ** digits;
}

export const withRound = (value, digits = 4) => {
  return (Number(value) + 5 / 10 ** (digits + 1)).toFixed(digits);
}

export const isValidAddress = (addr) => {
  return ethers.utils.isAddress(addr);
}

export const getReferralAddr = () => {
  const referral = window.localStorage.getItem('ref');
  if (isValidAddress(referral)) {
    return referral;
  } else {
    return DEFAULT_REFERRAL_ADDR;
  }
}

export const leading0 = (num) => {
  return num < 10 ? "0" + num : num;
}

export const formatDateTime = (time) => {
  return formatDateFn(time * 1000, "MMM dd, yyyy, h:mm a");
}

export const getUtcNow = () => {
  const now = new Date();
  return now.getTime();
}

export const drawClock = (deadline) => {
  const now = getUtcNow();
  let time = deadline - now;
  if (deadline < now) {
    time = 0;
  }
  const seconds = Math.floor((time) % 60);
  const minutes = Math.floor((time / 60) % 60);
  const hours = Math.floor((time / (60 * 60)) % 24);
  const days = Math.floor(time / (60 * 60 * 24));
  return leading0(days) + ' : ' + leading0(hours) + ' : ' + leading0(minutes) + ' : ' + leading0(seconds);
}