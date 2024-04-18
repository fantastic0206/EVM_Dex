import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { ethers } from "ethers";
import { decodeError } from "ethers-decode-error";
import { useAccount, useNetwork } from "wagmi";
import {
  useEthersSigner,
  useEthersProvider,
} from "@utils/ethersAdapter";
import { CONFIG, ABI } from "@utils/config";
import {
  fromWei,
  toWei,
  isValidAddress,
  getUtcNow,
} from "@utils/utils";
import useApiContext from "@context/ApiContext";
import { toast } from "react-toastify";
import { TX_TYPE, MAXIMUM_APPROVE } from "@utils/constants";
import Web3 from 'web3';

export const useSigningWeb3Client = () => {
  const [params] = useSearchParams();
  const [ethBalance, setEthBalance] = useState(0);
  const [tokenBalance, setTokenBalance] = useState(0);
  const [tokenAllowance, setTokenAllowance] = useState(0);
  const [loading, setLoading] = useState(false);
  const [pending, setPending] = useState(false);
  const [txType, setTxType] = useState(TX_TYPE.NONE);
  const [ethReserve, setEthReserve] = useState(0);
  const [tokenReserve, setTokenReserve] = useState(0);
  const [userBond, setUserBond] = useState();
  const [userData, setUserData] = useState();
  const [owner, setOwner] = useState();
  const [globalLiquidityBonus, setGlobalLiquidityBonus] = useState(0);
  const [bondActivations, setBondActivations] = useState([
    true,
    false,
    false,
    false,
  ]);
  const { chain } = useNetwork();
  const { pricePLS } = useApiContext();

  const signer = useEthersSigner(chain?.id ?? CONFIG.CHAIN_ID);
  const provider = useEthersProvider(chain?.id ?? CONFIG.CHAIN_ID);
 
  const { address } = useAccount();

  useEffect(() => {
    getProtocolOwner();
    updateUserInfo();
    const intVal = setInterval(() => {
      updateUserInfo();
    }, 3 * 60 * 1000); // 3 mins
    return (() => clearInterval(intVal))
  }, [address]);

  useEffect(() => {
    const referral = params.get("ref");
    const localRef = window.localStorage.getItem("ref");
    if (isValidAddress(referral) && referral !== address && !localRef) {
      window.localStorage.setItem("ref", referral);
    }
  }, [params, address]);

  const updateGlobalInfo = async () => {
    try {
      const promise0 = getTokenLiquidity();
      const promise1 = getLiquidityGlobalBonusPercent();
      await Promise.all([promise0, promise1]);
    } catch (err) {
      console.log(err);
    }
  }

  const updateUserInfo = async () => {
    await updateGlobalInfo();
    if (address) {
      const promise1 = getEthBalance();
      const promise2 = getTokenBalance();
      const promise3 = getTokenAllowance();
      const promise4 = getUserBond();
      const promise5 = getUIData();
      setLoading(true);
      await Promise.all([promise1, promise2, promise3, promise4, promise5]);
      setLoading(false);
    } else {
      setTokenBalance(0);
      setTokenAllowance(0);
      setUserBond(null);
      setUserData(null);
    }
  };

  /*************************  Read Function   ****************************/
  const getEthBalance = async () => {
    try {
      if (!provider) return;
      const balance = await provider.getBalance(address)
      setEthBalance(fromWei(balance));
    } catch (err) {
      console.log(err);
    }
  };
  
  const getTokenBalance = async () => {
    try {
      const contract = new ethers.Contract(
        CONFIG.SAM_CONTRACT,
        ABI.SAM,
        provider
      );
      const result = await contract.balanceOf(address);
      setTokenBalance(fromWei(result));
    } catch (err) {
      console.log(err);
    }
  };

  const getTokenBalanceByAddress = async (addr) => {
    try {
      const contract = new ethers.Contract(
        CONFIG.SAM_CONTRACT,
        ABI.SAM,
        provider
      );
      const result = await contract.balanceOf(addr);
      return fromWei(result);
    } catch (err) {
      console.log(err);
    }
  };

  const getTokenAllowance = async () => {
    try {
      const contract = new ethers.Contract(
        CONFIG.SAM_CONTRACT,
        ABI.SAM,
        provider
      );
      const result = await contract.allowance(address, CONFIG.PROTOCOL_CONTRACT);
      setTokenAllowance(fromWei(result));
    } catch (err) {
      console.log(err);
      return 0;
    }
  };

  const getTokenLiquidity = async () => {
    try {
      // const web3 = new Web3(CONFIG.CHAIN_RPC);
      // const contract = new web3.eth.Contract(ABI.PROTOCOL, CONFIG.PROTOCOL_CONTRACT);
      // let result = await contract.methods.getTokenLiquidity().call();
      // setEthReserve(fromWei(result?.liquidityETH));
      // setTokenReserve(fromWei(result?.liquidityERC20));
      // ethers 
      const contract = new ethers.Contract(
        CONFIG.PROTOCOL_CONTRACT,
        ABI.PROTOCOL,
        provider
      );
      const result = await contract.getTokenLiquidity();
      setEthReserve(fromWei(result?.liquidityETH));
      setTokenReserve(fromWei(result?.liquidityERC20));
    } catch (err) {
      console.log(err);
    }
  };

  const getTokensAmount = async (ethAmount) => {
    try {
      const contract = new ethers.Contract(
        CONFIG.PROTOCOL_CONTRACT,
        ABI.PROTOCOL,
        provider
      );
      const result = await contract.getTokensAmount(toWei(ethAmount));
      return fromWei(result);
    } catch (err) {
      console.log(err);
    }
  };

  const getProtocolOwner = async () => {
    try {
      const contract = new ethers.Contract(
        CONFIG.PROTOCOL_CONTRACT,
        ABI.PROTOCOL,
        provider
      );
      const result = await contract.owner();
      setOwner(result);
    } catch (err) {
      console.log(err);
    }
  };

  const getLiquidityGlobalBonusPercent = async () => {
    try {
      // const web3 = new Web3(CONFIG.CHAIN_RPC);
      // const contract = new web3.eth.Contract(ABI.PROTOCOL, CONFIG.PROTOCOL_CONTRACT);
      // let result = await contract.methods.getLiquidityGlobalBonusPercent().call();
      // setGlobalLiquidityBonus((Number(result) / 10000) * 100);
      
      // ethers
      const contract = new ethers.Contract(
        CONFIG.PROTOCOL_CONTRACT,
        ABI.PROTOCOL,
        provider
      );
      const result = await contract.getLiquidityGlobalBonusPercent();
      setGlobalLiquidityBonus((Number(result) / 10000) * 100);
    } catch (err) {
      console.log(err);
    }
  }

  // const getBondActivations = async () => {
  //   try {
  //     const contract = new ethers.Contract(
  //       CONFIG.PROTOCOL_CONTRACT,
  //       ABI.PROTOCOL,
  //       provider
  //     );
  //     let awaitArr = [];
  //     for (let i = 0; i < 4; i++) {
  //       const result = contract.BOND_ACTIVATIONS(i);
  //       awaitArr.push(result);
  //     }
  //     const result = await Promise.all(awaitArr);
  //     console.log("[BondActivations]: ", result);
  //     setBondActivations(result);
  //   } catch (err) {
  //     console.log(err);
  //   }
  // };

  const getUserBond = async () => {
    try {
      const contract = new ethers.Contract(
        CONFIG.PROTOCOL_CONTRACT,
        ABI.PROTOCOL,
        provider
      );
      let bondArr = [];
      const res = await contract.users(address);
      for (let i = 0; i < res.bondsNumber; i++) {
        const bond = await contract.bonds(address, i);
        bondArr.push(bond);
      }
      const userInfo = {
        user: res,
        bonds: bondArr,
      };
      setUserBond(userInfo);
    } catch (err) {
      console.log(err);
    }
  };

  const getUIData = async () => {
    try {
      if (!address) return;
      const contract = new ethers.Contract(
        CONFIG.PROTOCOL_CONTRACT,
        ABI.PROTOCOL,
        provider
      );
      const result = await contract.getUIData(address);
      const r = result[0];
      const data = {
        upline: r.upline,
        refLevel: r.refLevel,
        bondsNumber: r.bondsNumber,
        totalInvested: parseFloat(fromWei(r.totalInvested)),
        liquidityCreated: parseFloat(fromWei(r.liquidityCreated)),
        totalRefReward: parseFloat(fromWei(r.totalRefReward)),
        totalRebonded: parseFloat(fromWei(r.totalRebonded)),
        totalSold: parseFloat(fromWei(r.totalSold)),
        totalClaimed: parseFloat(fromWei(r.totalClaimed)),
        refTurnover: parseFloat(fromWei(r.refTurnover)),
        userAvailableAmount: parseFloat(fromWei(result.userTokensBalance)),
        userHoldBonus: ((Number(result.userHoldBonus) / 10000) * 100).toFixed(2),
        userLiquidityBonus: ((Number(result.userLiquidityBonus) / 10000) * 100).toFixed(2),
        globalLiquidityBonus: ((Number(result.globalLiquidityBonus) / 10000) * 100).toFixed(2),
        bondTypeStatus: {
          0: result[5][0],
          1: result[5][1],
          2: result[5][2],
          3: result[5][3],
        },
        referralsNumber: parseFloat(r.refsNumber),
        referrals: r.refs,
      };
      setBondActivations(result?.bondActivations?.slice(0, 4))
      setUserData(data);
    } catch (err) {
      console.log(err);
    }
  };

  const tokenToUsd = (tokenAmount) => {
    return !tokenAmount || !pricePLS ? "0.00" : Number(tokenAmount) * pricePLS;
  };

  const tokenToCoin = (tokenAmount) => {
    return !tokenAmount || tokenReserve <= 0 || Number(tokenAmount) < 0.1
      ? "0.0000"
      : (Number(tokenAmount) * ethReserve) / tokenReserve;
  };

  /*************************  Write Function   ****************************/
  const buyToken = async (uplineAddress, bondType, ethAmount) => {
    try {
      setPending(true);
      setTxType(TX_TYPE.BUY);
      const contract = new ethers.Contract(
        CONFIG.PROTOCOL_CONTRACT,
        ABI.PROTOCOL,
        signer
      );
      const params = [uplineAddress, bondType];
      const transaction = {
        from: address,
        to: CONFIG.PROTOCOL_CONTRACT,
        data: contract.interface.encodeFunctionData("buy", params),
        value: toWei(ethAmount),
      };

      await provider.estimateGas(transaction);
      const tx = await contract.buy(uplineAddress, bondType, {
        value: toWei(ethAmount),
      });
      toast.success(
        "Transaction has successfully entered the blockchain! Waiting for enough confirmations..."
      );
      await tx.wait();
      await updateUserInfo();
      toast.success(
        <span>
          Successfully bonded the token.{" "}
          <a
            className="text-blue-500"
            href={`${CONFIG.CHAIN_SCAN}${tx?.hash}`}
            target="_blank"
            rel="noreferrer"
          >
            View on scan
          </a>
        </span>
      );
    } catch (err) {
      console.log(err);
      const { error } = decodeError(err);
      toast.error(error);
    } finally {
      setTxType(TX_TYPE.NONE);
      setPending(false);
    }
  };

  const withdrawToken = async (bondIndex) => {
    try {
      setPending(true);
      setTxType(TX_TYPE.WITHDRAW);
      const contract = new ethers.Contract(
        CONFIG.PROTOCOL_CONTRACT,
        ABI.PROTOCOL,
        signer
      );
      const params = [bondIndex];
      const transaction = {
        from: address,
        to: CONFIG.PROTOCOL_CONTRACT,
        data: contract.interface.encodeFunctionData("transfer", params),
      };

      await provider.estimateGas(transaction);
      const tx = await contract.transfer(bondIndex);
      toast.success(
        "Transaction has successfully entered the blockchain! Waiting for enough confirmations..."
      );
      await tx.wait();
      await updateUserInfo();
      toast.success(
        <span>
          Successfully withdrawn the token.{" "}
          <a
            className="text-blue-500"
            href={`${CONFIG.CHAIN_SCAN}${tx?.hash}`}
            target="_blank"
            rel="noreferrer"
          >
            View on scan
          </a>
        </span>
      );
    } catch (err) {
      console.log(err);
      const { error } = decodeError(err);
      toast.error(error);
    } finally {
      setTxType(TX_TYPE.NONE);
      setPending(false);
    }
  };

  const stake = async (bondIndex, ethAmount) => {
    try {
      setPending(true);
      setTxType(TX_TYPE.STAKE);
      const contract = new ethers.Contract(
        CONFIG.PROTOCOL_CONTRACT,
        ABI.PROTOCOL,
        signer
      );
      const params = [bondIndex];
      const transaction = {
        from: address,
        to: CONFIG.PROTOCOL_CONTRACT,
        data: contract.interface.encodeFunctionData("stake", params),
        value: toWei(ethAmount),
      };

      await provider.estimateGas(transaction);
      const tx = await contract.stake(bondIndex, { value: toWei(ethAmount) });
      toast.success(
        "Transaction has successfully entered the blockchain! Waiting for enough confirmations..."
      );
      await tx.wait();
      await updateUserInfo();
      toast.success(
        <span>
          Successfully staked the token.{" "}
          <a
            className="text-blue-500"
            href={`${CONFIG.CHAIN_SCAN}${tx?.hash}`}
            target="_blank"
            rel="noreferrer"
          >
            View on scan
          </a>
        </span>
      );
    } catch (err) {
      console.log(err);
      const { error } = decodeError(err);
      toast.error(error);
    } finally {
      setTxType(TX_TYPE.NONE);
      setPending(false);
    }
  };

  const rebond = async (tokenAmount) => {
    try {
      setPending(true);
      setTxType(TX_TYPE.REBOND);
      const contract = new ethers.Contract(
        CONFIG.PROTOCOL_CONTRACT,
        ABI.PROTOCOL,
        signer
      );
      const params = [toWei(tokenAmount)];
      const transaction = {
        from: address,
        to: CONFIG.PROTOCOL_CONTRACT,
        data: contract.interface.encodeFunctionData("rebond", params),
      };

      await provider.estimateGas(transaction);
      const tx = await contract.rebond(toWei(tokenAmount));
      toast.success(
        "Transaction has successfully entered the blockchain! Waiting for enough confirmations..."
      );
      await tx.wait();
      await updateUserInfo();
      toast.success(
        <span>
          Successfully rebonded the token.{" "}
          <a
            className="text-blue-500"
            href={`${CONFIG.CHAIN_SCAN}${tx?.hash}`}
            target="_blank"
            rel="noreferrer"
          >
            View on scan
          </a>
        </span>
      );
    } catch (err) {
      console.log(err);
      const { error } = decodeError(err);
      toast.error(error);
    } finally {
      setTxType(TX_TYPE.NONE);
      setPending(false);
    }
  };

  const claim = async (tokenAmount) => {
    try {
      setPending(true);
      setTxType(TX_TYPE.CLAIM);
      const contract = new ethers.Contract(
        CONFIG.PROTOCOL_CONTRACT,
        ABI.PROTOCOL,
        signer
      );
      const params = [toWei(tokenAmount)];
      const transaction = {
        from: address,
        to: CONFIG.PROTOCOL_CONTRACT,
        data: contract.interface.encodeFunctionData("claim", params),
      };

      await provider.estimateGas(transaction);
      const tx = await contract.claim(toWei(tokenAmount));
      toast.success(
        "Transaction has successfully entered the blockchain! Waiting for enough confirmations..."
      );
      await tx.wait();
      await updateUserInfo();
      toast.success(
        <span>
          Successfully claimed the token.{" "}
          <a
            className="text-blue-500"
            href={`${CONFIG.CHAIN_SCAN}${tx?.hash}`}
            target="_blank"
            rel="noreferrer"
          >
            View on scan
          </a>
        </span>
      );
    } catch (err) {
      console.log(err);
      const { error } = decodeError(err);
      toast.error(error);
    } finally {
      setTxType(TX_TYPE.NONE);
      setPending(false);
    }
  };

  const approve = async () => {
    try {
      setPending(true);
      setTxType(TX_TYPE.APPROVE);
      const contract = new ethers.Contract(
        CONFIG.SAM_CONTRACT,
        ABI.SAM,
        signer
      );
      const tokenAmount = MAXIMUM_APPROVE.toString();
      const params = [CONFIG.PROTOCOL_CONTRACT, toWei(tokenAmount)];
      const transaction = {
        from: address,
        to: CONFIG.SAM_CONTRACT,
        data: contract.interface.encodeFunctionData("approve", params),
      };

      await provider.estimateGas(transaction);
      const tx = await contract.approve(
        CONFIG.PROTOCOL_CONTRACT,
        toWei(tokenAmount)
      );
      toast.success(
        "Transaction has successfully entered the blockchain! Waiting for enough confirmations..."
      );
      await tx.wait();
      await updateUserInfo();
      toast.success(
        <span>
          Successfully approved the token.{" "}
          <a
            className="text-blue-500"
            href={`${CONFIG.CHAIN_SCAN}${tx?.hash}`}
            target="_blank"
            rel="noreferrer"
          >
            View on scan
          </a>
        </span>
      );
    } catch (err) {
      console.log(err);
      const { error } = decodeError(err);
      toast.error(error);
    } finally {
      setTxType(TX_TYPE.NONE);
      setPending(false);
    }
  };

  const sell = async (tokenAmount) => {
    try {
      setPending(true);
      setTxType(TX_TYPE.SELL);
      const contract = new ethers.Contract(
        CONFIG.PROTOCOL_CONTRACT,
        ABI.PROTOCOL,
        signer
      );
      const params = [toWei(tokenAmount)];
      const transaction = {
        from: address,
        to: CONFIG.PROTOCOL_CONTRACT,
        data: contract.interface.encodeFunctionData("sell", params),
      };

      await provider.estimateGas(transaction);
      const tx = await contract.sell(toWei(tokenAmount));
      toast.success(
        "Transaction has successfully entered the blockchain! Waiting for enough confirmations..."
      );
      await tx.wait();
      await updateUserInfo();
      toast.success(
        <span>
          Successfully sold the token.{" "}
          <a
            className="text-blue-500"
            href={`${CONFIG.CHAIN_SCAN}${tx?.hash}`}
            target="_blank"
            rel="noreferrer"
          >
            View on scan
          </a>
        </span>
      );
    } catch (err) {
      console.log(err);
      const { error } = decodeError(err);
      toast.error(error);
    } finally {
      setTxType(TX_TYPE.NONE);
      setPending(false);
    }
  };

  const sellInDex = async (tokenAmount) => {
    try {
      setPending(true);
      setTxType(TX_TYPE.SELL);
      const contract = new ethers.Contract(
        CONFIG.ROUTER_CONTRACT,
        ABI.ROUTER,
        signer
      );
      const params = [
        toWei(tokenAmount),
        0,
        [CONFIG.SAM_CONTRACT, CONFIG.WPLS_CONTRACT],
        address,
        getUtcNow() + 10 ** 5,
      ];
      const transaction = {
        from: address,
        to: CONFIG.ROUTER_CONTRACT,
        data: contract.interface.encodeFunctionData(
          "swapExactTokensForETH",
          params
        ),
      };

      await provider.estimateGas(transaction);
      const tx = await contract.swapExactTokensForETH(
        toWei(tokenAmount),
        0,
        [CONFIG.SAM_CONTRACT, CONFIG.WPLS_CONTRACT],
        address,
        getUtcNow() + 10 ** 5
      );
      toast.success(
        "Transaction has successfully entered the blockchain! Waiting for enough confirmations..."
      );
      await tx.wait();
      await updateUserInfo();
      toast.success(
        <span>
          Successfully sold the token.{" "}
          <a
            className="text-blue-500"
            href={`${CONFIG.CHAIN_SCAN}${tx?.hash}`}
            target="_blank"
            rel="noreferrer"
          >
            View on scan
          </a>
        </span>
      );
    } catch (err) {
      console.log(err);
      const { error } = decodeError(err);
      toast.error(error);
    } finally {
      setTxType(TX_TYPE.NONE);
      setPending(false);
    }
  };

  const influencerBond = async (userAddr, tokenAmount) => {
    try {
      setPending(true);
      setTxType(TX_TYPE.FREE_BOND);
      const contract = new ethers.Contract(
        CONFIG.PROTOCOL_CONTRACT,
        ABI.PROTOCOL,
        signer
      );
      const params = [userAddr, toWei(tokenAmount)];
      const transaction = {
        from: address,
        to: CONFIG.PROTOCOL_CONTRACT,
        data: contract.interface.encodeFunctionData("influencerBond", params),
      };

      await provider.estimateGas(transaction);
      const tx = await contract.influencerBond(userAddr, toWei(tokenAmount));
      toast.success(
        "Transaction has successfully entered the blockchain! Waiting for enough confirmations..."
      );
      await tx.wait();
      toast.success(
        <span>
          Successfully bonded the tokens to the influencer.{" "}
          <a
            className="text-blue-500"
            href={`${CONFIG.CHAIN_SCAN}${tx?.hash}`}
            target="_blank"
            rel="noreferrer"
          >
            View on scan
          </a>
        </span>
      );
    } catch (err) {
      console.log(err);
      const { error } = decodeError(err);
      toast.error(error);
    } finally {
      setTxType(TX_TYPE.NONE);
      setPending(false);
    }
  };

  return {
    loading,
    pending,
    txType,
    address,
    owner,
    ethBalance,
    tokenBalance,
    tokenAllowance,
    ethReserve,
    tokenReserve,
    userBond,
    userData,
    bondActivations,
    globalLiquidityBonus,

    getTokensAmount,
    getTokenLiquidity,
    getTokenBalanceByAddress,
    getUIData,
    tokenToUsd,
    tokenToCoin,

    buyToken,
    withdrawToken,
    stake,
    rebond,
    claim,
    approve,
    sell,
    sellInDex,
    influencerBond
  };
};
