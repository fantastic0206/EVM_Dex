import { CONFIG, TESTNET } from "./config";

export const PULSEX_SWAP = TESTNET ? "https://app.v4.testnet.pulsex.com/swap" : "https://app.pulsex.com/swap"
export const PULSEX_LINK = PULSEX_SWAP + `?outputCurrency=${CONFIG.SAM_CONTRACT}`
export const BOND_FREEZE_PERIODS = [30, 20, 10, 5];
export const BOND_FREEZE_PERCENTS = [3000, 2000, 1000, 500];
export const DEFAULT_REFERRAL_ADDR = "0xd455db13DcF4354357765a3785ffF2A714526f3f"

export const ONE_DAY = 24 * 60 * 60;        // 1 Day to Seconds
export const ONE_WEEK = 7 * ONE_DAY;        // 1 Week to Seconds
export const ONE_MONTH = 30 * ONE_DAY;      // 1 Month(30 Days) to Seconds
export const ONE_YEAR = 12 * ONE_MONTH;     // 1 Year(12 Months) to Seconds

export const ONE_YEAR_MONTH = 12;
export const ONE_MONTH_DAY = 30;

export const BASE_PERC = 2;
export const INCOME_PERCENT = 30;
export const BOND_LIMIT = 255;
export const MIN_BOND_ETH = 40_000;
export const MIN_BOND_TOKENS = 100;
export const MAXIMUM_APPROVE = 2n ** 128n;

export const TX_TYPE = {
  NONE: 'none',
  BUY: 'buy',
  WITHDRAW: 'withdraw',
  STAKE: 'stake',
  REBOND: 'rebond',
  APPROVE: 'approve',
  SELL: 'sell',
  CLAIM: 'claim',
  FREE_BOND: 'free_bond'
}