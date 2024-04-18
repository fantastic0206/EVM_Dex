const SAM_ABI = require("../abis/sam.json");
const PROTOCOL_ABI = require("../abis/protocol.json");
const LP_ABI = require("../abis/lp.json");
const ROUTER_ABI = require("../abis/router.json");

export const TESTNET = false;
export const ABI = {
  SAM: SAM_ABI.abi,
  PROTOCOL: PROTOCOL_ABI.abi,
  LP: LP_ABI.abi,
  ROUTER: ROUTER_ABI.abi
}

export const CONFIG = {
  CHAIN_ID: TESTNET ? 943 : 369,
  CHAIN_RPC: TESTNET ? "https://pulsechain-testnet.publicnode.com" : "https://rpc.pulsechain.com",
  CHAIN_SCAN: TESTNET ? "https://scan.v4.testnet.pulsechain.com/tx/" : "https://scan.pulsechain.com/",
  ALCHEMY_APIKEY: "UrKewpGwON-2ZVZgTmpce7nTdU9IEEod",
  INFURA_APIKEY: "3feaca202a9e4278afa8fcbb7b9e3cc4",
  SAM_CONTRACT: TESTNET ? "" : "0xC4BBe5A95C1bEEd931A586B70Df0b080c5be438b",
  LP_CONTRACT: TESTNET ? "" : "0x4080ef4B20850b7AB060bC05ACE9954A90a356CC",
  PROTOCOL_CONTRACT: TESTNET ? "" : "0x612661629bC61263804De82f9C4533DA194F922E",
  ROUTER_CONTRACT: TESTNET ? "0x636f6407b90661b73b1c0f7e24f4c79f624d0738" : "0x98bf93ebf5c380C0e6Ae8e192A7e2AE08edAcc02",
  WPLS_CONTRACT: TESTNET? "0x70499adEBB11Efd915E3b69E700c331778628707" : "0xA1077a294dDE1B09bB078844df40758a5D0f9a27",
}

export const API = {
  PRICE: "https://v.gopulse.com/api/prices"
}