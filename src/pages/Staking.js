import { useMemo, useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "@mui/material/Button";
import { Icon } from "@iconify/react";
import ReactLoading from "react-loading";
import IconButton from "@mui/material/IconButton";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import { Tooltip as ReactTooltip } from "react-tooltip";
import useApiContext from "@context/ApiContext";
import useWeb3Context from "@context/web3Context";
import {
  numberWithCommas,
  withRound,
  fromWei,
  getUtcNow,
  makeShort,
  copyToClipboard,
} from "@utils/utils";
import SelectBond from "@components/SelectBond";
import Divider from "@components/Divider";
import ReBondModal from "./Modal/ReBond";
import SellModal from "./Modal/Sell";
import ClaimModal from "./Modal/Claim";
import { ONE_DAY, BASE_PERC, TX_TYPE, PULSEX_LINK } from "@utils/constants";
import { CONFIG } from "@utils/config";
import { toast } from "react-toastify";

const Staking = () => {
  const {
    loading,
    pending,
    txType,
    address,
    ethBalance,
    ethReserve,
    tokenReserve,
    globalLiquidityBonus,
    userBond,
    userData,
    tokenToUsd,
    tokenToCoin,
    stake,
    getUIData,
  } = useWeb3Context();
  const { pricePLS } = useApiContext();
  const navigate = useNavigate();
  const [ethAmount, setEthAmount] = useState(0);
  const [bondIdx, setBondIdx] = useState(-1);
  const [isRebond, setRebond] = useState(false);
  const [isSell, setSell] = useState(false);
  const [isClaim, setClaim] = useState(false);

  const totalLiquidity = useMemo(() => {
    return ethReserve * 2 * pricePLS;
  }, [pricePLS, ethReserve]);

  const handleChange = (e, v) => {
    if (v < 0) return;
    const bond = userBond?.bonds[v];
    if (ethReserve === 0 || !bond) return;
    setBondIdx(v);
    const amount =
      (fromWei(bond.amount) * (100 + parseInt(bond.profitPercent) / 100)) / 100;
    setEthAmount(withRound(amount));
  };

  const handleStake = async () => {
    if (!address || bondIdx < 0) {
      navigate("/bonding");
      return;
    }
    if (ethBalance < Number(ethAmount)) {
      toast.warn("Insufficient PLS balance to stake");
      return;
    }
    await stake(bondIdx, Number(ethAmount));
  };

  const isStakeActive = (bond, data) => {
    const valueA =
      (getPassedDaysOnStake(parseInt(bond.stakeTime)) *
        fromWei(bond.stakeAmount) *
        (Number(data?.userHoldBonus || 0) +
          Number(data?.globalLiquidityBonus || 0) +
          Number(data?.userLiquidityBonus || 0) +
          Number(BASE_PERC))) /
      100;
    const valueB = fromWei(bond.stakeAmount) * 1.5;
    return Number(valueA.toFixed(4)) < Number(valueB.toFixed(4));
  };

  const getPassedDaysOnStake = (time) => {
    const value = Math.floor((Math.floor(getUtcNow() / 1000) - time) / ONE_DAY);
    if (value < 0) return 0;
    else return value;
  };

  const getPassedDaysOnStakeWithoutRound = (time) => {
    const value = (Math.floor(getUtcNow() / 1000) - time) / ONE_DAY;
    if (value < 0) return "-";
    else return value.toFixed(4);
  };

  const totalStaked = useMemo(() => {
    if (!userBond || !userData) return 0;
    let value = 0;
    for (let i = 0; i < userBond?.bonds?.length; i++) {
      const bond = userBond.bonds[i];
      if (isStakeActive(bond, userData)) {
        value += fromWei(bond.stakeAmount);
      }
    }
    return value;
  }, [userBond, userData]);

  const addTokenCallback = useCallback(async () => {
    const tokenAddress = CONFIG.SAM_CONTRACT;
    const tokenSymbol = "SAM";
    const tokenDecimals = 18;
    const tokenImage = `https://ucarecdn.com/2809d6a8-7731-420a-bc91-f6d1e41dee03/Sam.png`;

    try {
      const wasAdded = await window.ethereum.request({
        method: "wallet_watchAsset",
        params: {
          type: "ERC20",
          options: {
            address: tokenAddress,
            symbol: tokenSymbol,
            decimals: tokenDecimals,
            image: tokenImage,
          },
        },
      });

      if (wasAdded) {
        console.log("Adding SAM token");
      } else {
        console.log("SAM token has been added to you wallet!");
      }
    } catch (error) {
      console.log(error);
    }
  }, []);

  const handleRebondClose = () => {
    setRebond(false);
  };

  const handleSellClose = () => {
    setSell(false);
  };

  const handleClaimClose = () => {
    setClaim(false);
  };

  const handleCopyPair = () => {
    copyToClipboard(CONFIG.LP_CONTRACT);
    toast.success("Successfully copied the referral link.");
  };

  return (
    <div className="flex flex-col container mx-auto z-50 dark:text-neutral-50 mb-auto">
      <div className="px-6 pt-8 pb-6 text-4xl font-bold text-white">
        Stake SAM
      </div>
      <div className="flex flex-col lg:flex-row gap-3">
        <div className="flex flex-col gap-3 w-full lg:w-1/3">
          <div className="flex flex-col gap-[13px] rounded-2xl w-full h-fit mx-auto bg-white text-center dark:bg-[#161F3E] shadow-card px-6 py-4">
            <div className="w-full h-20 mt-3">
              <SelectBond
                options={userBond?.bonds}
                pricePLS={pricePLS}
                tokenReserve={tokenReserve}
                ethReserve={ethReserve}
                onChange={handleChange}
              />
            </div>
            <div className="flex justify-between bg-[#FFF7E7] dark:bg-[#0B122C] border border-app-color dark:border-[#0d183f] border-opacity-20 px-4 py-3 h-20">
              <div className="flex flex-col w-[calc(100%-60px)] justify-start items-stretch">
                <input
                  className="w-full  font-semibold text-2xl bg-transparent focus-visible:outline-none"
                  readOnly
                  value={ethAmount}
                ></input>
                <span className="text-gray-400 font-light text-left">
                  ${numberWithCommas(tokenToUsd(ethAmount), 6)}
                </span>
              </div>
              <div className="flex flex-col">
                <div className="flex items-center justify-end gap-2">
                  <img src="assets/pls.png" alt="pls" width="32" height="32" />
                  <span className="text-app-color text-2xl font-bold">PLS</span>
                </div>
                <span className="text-gray-400 font-light whitespace-nowrap">
                  Balance: {numberWithCommas(ethBalance)}
                </span>
              </div>
            </div>

            <div className="flex justify-center items-center gap-2 ">
              <img src="assets/sam.png" alt="pls" width="30" height="30" />
              <span>1 SAM</span>
              <span>=</span>
              <span className="text-app-color">
                {numberWithCommas(tokenToCoin(1), 6)} PLS
              </span>
            </div>
            <div className="w-full py-3">
              <Button
                variant="contained"
                sx={{
                  width: "100%",
                  borderRadius: "100px",
                  fontSize: "20px",
                  backgroundSize: "150% 100%",
                  backgroundImage:
                    "linear-gradient(210deg, #00eaff 0%, #0080ff 25%, #8000ff 60%, #e619e6 84%, #f00 100%)",
                  transition: "all .4s ease-in-out",
                  "&:hover": {
                    backgroundPosition: "100% 0",
                    transition: "all .4s ease-in-out",
                  },
                  "&:disabled": {
                    opacity: "0.6",
                  },
                }}
                disabled={pending && txType === TX_TYPE.STAKE}
                onClick={handleStake}
              >
                {pending && txType === TX_TYPE.STAKE ? (
                  <div className="flex items-center gap-2">
                    <ReactLoading
                      color="#fff"
                      type="spin"
                      width={25}
                      height={25}
                      className="transition"
                    />
                    <span className="text-white">PENDING...</span>
                  </div>
                ) : (
                  <span className="text-white">
                    {bondIdx >= 0 ? "Stake" : "Buy a bond"}
                  </span>
                )}
              </Button>
            </div>
          </div>
          <div className="flex flex-col gap-4 rounded-2xl w-full h-fit mx-auto bg-white text-center dark:bg-[#161F3E] shadow-card px-6 py-6">
            <div className="flex justify-between">
              <span>Total Liquidity</span>
              <span className="dark:text-gray-400">
                ${numberWithCommas(totalLiquidity)}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="truncate">Token Price</span>
              <div className="flex items-center gap-2">
                <img src="assets/sam.png" alt="pls" width="30" height="30" />
                <span className="dark:text-neutral-400 truncate">
                  1 SAM = {numberWithCommas(tokenToUsd(tokenToCoin(1)), 4)} USD
                </span>
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-3 w-full lg:w-2/3">
          <div className="flex flex-col xl:flex-row gap-3">
            <div className="flex flex-col justify-between gap-[26px] rounded-2xl w-full mx-auto bg-white text-center dark:bg-[#161F3E] shadow-card px-6 py-4">
              <span className="mt-3 text-left ">Available tokens</span>
              <div className="flex items-center gap-2 ">
                <img src="assets/sam.png" alt="pls" width="46" height="46" />
                <div className="flex items-end gap-2">
                  <span className="text-4xl font-semibold">
                    {numberWithCommas(userData?.userAvailableAmount)}
                  </span>
                  <span className="text-lg">≈</span>
                  <span className="text-lg">
                    {numberWithCommas(
                      tokenToCoin(userData?.userAvailableAmount)
                    )}{" "}
                    PLS
                  </span>
                </div>
              </div>
              <div className="w-full flex gap-5 py-3 text-left">
                <Button
                  variant="outlined"
                  color="warning"
                  sx={{
                    color: "#af0cf2",
                    padding: "3px 18px",
                    borderColor: "#af0cf2",
                    borderRadius: "100px",
                    fontSize: "16px",
                    transition: "all .3s ease-in-out",
                    "&:hover": {
                      borderColor: "#af0cf2",
                      background: "#af0cf2",
                      color: "white",
                      transition: "all .3s ease-in-out",
                    },
                  }}
                  onClick={() => {
                    getUIData();
                    setRebond(true);
                  }}
                >
                  ReBond
                </Button>
                <Button
                  variant="outlined"
                  color="warning"
                  sx={{
                    color: "#af0cf2",
                    padding: "3px 18px",
                    borderColor: "#af0cf2",
                    borderRadius: "100px",
                    fontSize: "16px",
                    transition: "all .3s ease-in-out",
                    "&:hover": {
                      borderColor: "#af0cf2",
                      background: "#af0cf2",
                      color: "white",
                      transition: "all .3s ease-in-out",
                    },
                  }}
                  onClick={() => {
                    getUIData();
                    setSell(true);
                  }}
                >
                  Sell
                </Button>
                {false && userData?.userAvailableAmount > 0 && (
                  <Button
                    variant="outlined"
                    color="warning"
                    sx={{
                      color: "#af0cf2",
                      padding: "3px 18px",
                      borderColor: "#af0cf2",
                      borderRadius: "100px",
                      fontSize: "16px",
                      transition: "all .3s ease-in-out",
                      "&:hover": {
                        borderColor: "#af0cf2",
                        background: "#af0cf2",
                        color: "white",
                        transition: "all .3s ease-in-out",
                      },
                    }}
                    onClick={() => {
                      // getUIData();
                      // setClaim(true);
                    }}
                  >
                    Claim
                  </Button>
                )}
              </div>
              <Divider />
              <div className="flex gap-5 mb-3">
                <div className="flex flex-col">
                  <span>Pair address</span>
                  <div className="flex justify-center items-center gap-2 text-blue-500">
                    <span>{makeShort(CONFIG.LP_CONTRACT)}</span>
                    <IconButton size="small" onClick={handleCopyPair}>
                      <ContentCopyIcon
                        fontSize="small"
                        className="text-blue-500"
                      />
                    </IconButton>
                  </div>
                </div>
                <div className="flex flex-col gap-1">
                  <span>PulseX</span>
                  <a
                    href={PULSEX_LINK}
                    target="_blank"
                    rel="noreferrer"
                    className="text-blue-500"
                  >
                    Go to PulseX
                  </a>
                </div>
                <button
                  className="flex w-12 h-12 border border-app-color bg-transparent hover:bg-app-color transition duration-300 rounded-md"
                  onClick={addTokenCallback}
                >
                  <img src="assets/metamask.png" alt="metamask" />
                </button>
              </div>
            </div>
            <div className="flex flex-col justify-between gap-6 rounded-2xl w-full mx-auto bg-white text-center dark:bg-[#161F3E] shadow-card px-6 py-4">
              <span className="mt-3 text-left ">Your daily income</span>
              <span className="text-6xl ">
                +
                {userData
                  ? parseFloat(
                      (
                        Number(userData.userHoldBonus || 0) +
                        Number(userData.globalLiquidityBonus || 0) +
                        Number(userData.userLiquidityBonus || 0) +
                        Number(BASE_PERC)
                      ).toFixed(2)
                    )
                  : parseFloat(
                      (
                        Number(globalLiquidityBonus || 0) + Number(BASE_PERC)
                      ).toFixed(2)
                    )}
                %
              </span>
              <div className="flex justify-between items-center">
                <div className="flex gap-2">
                  <span>Base</span>
                  <Icon
                    data-tooltip-id="my-tooltip-3"
                    data-tooltip-html="Base Daily Staking Yield."
                    icon="ci:info"
                    className="w-6 h-6 p-0 "
                  />
                  <ReactTooltip id="my-tooltip-3" place="bottom" />
                </div>
                <span className="font-bold ">+{Number(BASE_PERC)}%</span>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex gap-2">
                  <span>Liquidity Bonus</span>
                  <Icon
                    data-tooltip-id="my-tooltip-4"
                    data-tooltip-html="For every 800M PLS in the liquidity<br/>pool on Pulsex.com, the daily yield<br/>will increase by 0.1%."
                    icon="ci:info"
                    className="w-6 h-6 p-0 "
                  />
                  <ReactTooltip id="my-tooltip-4" place="bottom" />
                </div>
                <span className="font-bold">
                  +{Number(globalLiquidityBonus || 0).toFixed(2)}%
                </span>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex gap-2">
                  <span>Hold Bonus</span>
                  <Icon
                    data-tooltip-id="my-tooltip-5"
                    data-tooltip-html="If you don't claim or sell tokens within<br/>24 hours, you'll receive an additional<br/>0.05% to your daily yield."
                    icon="ci:info"
                    className="w-6 h-6 p-0 "
                  />
                  <ReactTooltip id="my-tooltip-5" place="bottom" />
                </div>
                <span className="font-bold">
                  +{Number(userData?.userHoldBonus || 0).toFixed(2)}%
                </span>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex gap-2">
                  <span>Personal Bonus</span>
                  <Icon
                    data-tooltip-id="my-tooltip-6"
                    data-tooltip-html="For every 35M PLS added to the overall<br/>protocol liquidity, you'll receive an extra 0.1%."
                    icon="ci:info"
                    className="w-6 h-6 p-0 "
                  />
                  <ReactTooltip id="my-tooltip-6" place="bottom" />
                </div>
                <span className="font-bold ">
                  +{Number(userData?.userLiquidityBonus || 0).toFixed(2)}%
                </span>
              </div>
            </div>
          </div>
          <div className="flex flex-col justify-between gap-4 rounded-2xl w-full mx-auto bg-white text-center dark:bg-[#161F3E] shadow-card px-6 py-6">
            <span className="text-left ">Total staked</span>
            <div className="flex flex-col md:flex-row md:justify-between gap-3">
              <div className="flex flex-col justify-between w-full md:w-2/5">
                <div className="flex items-center gap-3">
                  <img src="assets/sam.png" alt="pls" width="48" height="48" />
                  <span className="text-3xl font-bold ">
                    {numberWithCommas(totalStaked)}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Icon
                    icon="typcn:info-outline"
                    className="w-6 h-6 p-0 text-app-color"
                  />
                  <span className="text-[12px] md:text-sm text-gray-500 dark:text-neutral-400">
                    Max staking income is 150%
                  </span>
                </div>
              </div>
              <div className="flex flex-col gap-3 w-full md:w-3/5">
                <div className="flex justify-between">
                  <span className="md:text-lg">Rebonded</span>
                  <span className="md:text-lg">
                    {numberWithCommas(userData?.totalRebonded)} SAM
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="md:text-lg">Sold</span>
                  <span className="md:text-lg">
                    {numberWithCommas(userData?.totalSold)} SAM
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="md:text-lg">Claimed</span>
                  <span className="md:text-lg">
                    {numberWithCommas(userData?.totalClaimed)} SAM
                  </span>
                </div>
              </div>
            </div>
            <Divider />
            {userBond?.bonds?.map((bond, idx) => {
              if (parseInt(bond.stakeTime) <= 0) return undefined;
              return (
                <div className="block xl:hidden py-2" key={idx}>
                  <div className="flex flex-col gap-2">
                    <div className="flex justify-between">
                      <span>
                        {numberWithCommas(fromWei(bond.stakeAmount))} SAM
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400 font-extralight ">
                        Days staked:
                      </span>
                      <span>
                        {getPassedDaysOnStake(parseInt(bond.stakeTime))} days
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400 font-extralight ">
                        Profit per day:
                      </span>
                      <span>
                        {isStakeActive(bond, userData) ? (
                          <div className="flex justify-center gap-2">
                            <img
                              src="assets/sam.png"
                              alt="pls"
                              width="26"
                              height="26"
                            />
                            <span>
                              {parseFloat(
                                (fromWei(bond.stakeAmount) *
                                  (Number(userData?.userHoldBonus || 0) +
                                    Number(
                                      userData?.globalLiquidityBonus || 0
                                    ) +
                                    Number(userData?.userLiquidityBonus || 0) +
                                    Number(BASE_PERC))) /
                                  100
                              ).toFixed(2)}
                            </span>
                          </div>
                        ) : (
                          "-"
                        )}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400 font-extralight ">
                        Profit for period:
                      </span>
                      <span>
                        <div className="flex justify-center items-center gap-2">
                          <img
                            src="assets/sam.png"
                            alt="pls"
                            width="26"
                            height="26"
                          />
                          <span>
                            {isStakeActive(bond, userData)
                              ? parseFloat(
                                  (getPassedDaysOnStakeWithoutRound(
                                    parseInt(bond.stakeTime)
                                  ) *
                                    fromWei(bond.stakeAmount) *
                                    (Number(userData?.userHoldBonus || 0) +
                                      Number(
                                        userData?.globalLiquidityBonus || 0
                                      ) +
                                      Number(
                                        userData?.userLiquidityBonus || 0
                                      ) +
                                      Number(BASE_PERC))) /
                                    100
                                ).toFixed(2)
                              : parseFloat(
                                  fromWei(bond.stakeAmount) * 1.5
                                ).toFixed(2)}
                          </span>
                        </div>
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400 font-extralight ">
                        Status:
                      </span>
                      <span>
                        {isStakeActive(bond, userData) ? (
                          <span className="block bg-green-200 text-green-500 rounded-lg w-24 py-1">
                            Active
                          </span>
                        ) : (
                          <span className="block bg-rose-200 text-red-400 rounded-lg w-24 py-1">
                            Completed
                          </span>
                        )}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
            <table className="table-auto hidden xl:table">
              <thead>
                <tr>
                  <th>Stake</th>
                  <th>Days staked</th>
                  <th>Profit per day</th>
                  <th>Profit for period</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {userBond?.bonds?.map((bond, idx) => {
                  if (parseInt(bond.stakeTime) <= 0) return undefined;
                  return (
                    <tr className="h-10" key={idx}>
                      <td className="text-center">
                        {numberWithCommas(fromWei(bond.stakeAmount))} SAM
                      </td>
                      <td className="text-center">
                        {getPassedDaysOnStake(parseInt(bond.stakeTime))} days
                      </td>
                      <td className="text-center">
                        {isStakeActive(bond, userData) ? (
                          <div className="flex justify-center gap-2">
                            <img
                              src="assets/sam.png"
                              alt="pls"
                              width="26"
                              height="26"
                            />
                            <span>
                              {parseFloat(
                                (fromWei(bond.stakeAmount) *
                                  (Number(userData?.userHoldBonus || 0) +
                                    Number(
                                      userData?.globalLiquidityBonus || 0
                                    ) +
                                    Number(userData?.userLiquidityBonus || 0) +
                                    Number(BASE_PERC))) /
                                  100
                              ).toFixed(2)}
                            </span>
                          </div>
                        ) : (
                          "-"
                        )}
                      </td>
                      <td className="text-center">
                        <div className="flex justify-center items-center gap-2">
                          <img
                            src="assets/sam.png"
                            alt="pls"
                            width="26"
                            height="26"
                          />
                          <span>
                            {isStakeActive(bond, userData)
                              ? parseFloat(
                                  (getPassedDaysOnStakeWithoutRound(
                                    parseInt(bond.stakeTime)
                                  ) *
                                    fromWei(bond.stakeAmount) *
                                    (Number(userData?.userHoldBonus || 0) +
                                      Number(
                                        userData?.globalLiquidityBonus || 0
                                      ) +
                                      Number(
                                        userData?.userLiquidityBonus || 0
                                      ) +
                                      Number(BASE_PERC))) /
                                    100
                                ).toFixed(2)
                              : parseFloat(
                                  fromWei(bond.stakeAmount) * 1.5
                                ).toFixed(2)}
                          </span>
                        </div>
                      </td>
                      <td>
                        <div className="flex justify-center items-center">
                          {isStakeActive(bond, userData) ? (
                            <span className="block bg-green-200 text-green-500 rounded-lg w-24 py-1">
                              Active
                            </span>
                          ) : (
                            <span className="block bg-rose-200 text-red-400 rounded-lg w-24 py-1">
                              Completed
                            </span>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <ReBondModal open={isRebond} onClose={handleRebondClose} />
      <SellModal open={isSell} onClose={handleSellClose} />
      <ClaimModal open={isClaim} onClose={handleClaimClose} />
    </div>
  );
};

export default Staking;
