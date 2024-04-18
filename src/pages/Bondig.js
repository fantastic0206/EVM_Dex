import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Icon } from "@iconify/react";
import AnimButton from "@components/AnimButton";
import Button from "@mui/material/Button";
import ReactLoading from "react-loading";
import { toast } from "react-toastify";
import useApiContext from "@context/ApiContext";
import useWeb3Context from "@context/web3Context";
import { Tooltip as ReactTooltip } from "react-tooltip";
import { numberWithCommas, getReferralAddr, fromWei } from "@utils/utils";
import {
  BOND_FREEZE_PERIODS,
  MIN_BOND_ETH,
  BOND_LIMIT,
  TX_TYPE,
} from "@utils/constants";
import { formatDateTime, getUtcNow } from "@utils/utils";
import Divider from "@components/Divider";

const Bonding = () => {
  const [bondType, setBondType] = useState(0);
  const [fromAmount, setFromAmount] = useState("");
  const { pricePLS } = useApiContext();
  const {
    loading,
    pending,
    txType,
    address,
    ethBalance,
    tokenBalance,
    ethReserve,
    tokenReserve,
    bondActivations,
    userBond,
    userData,
    buyToken,
    // withdrawToken,
  } = useWeb3Context();

  const fromAmountInUSD = useMemo(() => {
    if (Number(fromAmount) === 0 || Number(pricePLS) === 0) return 0;
    return Number(fromAmount) * Number(pricePLS);
  }, [fromAmount, pricePLS]);

  const toAmount = useMemo(() => {
    if (ethReserve === 0) return 0;
    return (Number(fromAmount) * tokenReserve) / ethReserve;
  }, [fromAmount, ethReserve, tokenReserve]);

  const samInPLS = useMemo(() => {
    if (ethReserve === 0) return 0;
    return ethReserve / tokenReserve;
  }, [ethReserve, tokenReserve]);

  const handleChange = async (e) => {
    const newValue = e.target.value;
    setFromAmount(newValue === "" ? "" : Number(newValue));
  };

  const handleBond = async () => {
    if (!address) {
      toast.warn("Please connect wallet");
      return;
    }
    if (fromAmount <= 0) {
      toast.warn("Please input the amount");
      return;
    }
    if (fromAmount < MIN_BOND_ETH) {
      toast.warn(
        "Bond: Minimum amount to bond is " +
          numberWithCommas(MIN_BOND_ETH) +
          " PLS"
      );
      return;
    }
    if (ethBalance > 0 && fromAmount > ethBalance) {
      toast.warn("Bond: Insufficient PLS balance");
      return;
    }
    if (Number(userData?.bondsNumber) + 1 > BOND_LIMIT) {
      toast.warn("Bond: You have reached bonds limit");
      return;
    }
    const refAddr = getReferralAddr();
    await buyToken(refAddr, bondType, fromAmount);
    setFromAmount("");
  };

  // const handleSell = async (bondIndex) => {
  //   await withdrawToken(bondIndex);
  //   setFromAmount("");
  // };

  return (
    <div className="container mx-auto px-4 sm:px-8">
      <div className="block rounded-2xl w-full max-w-[600px] mx-auto bg-white text-center shadow-card dark:bg-[#161F3E] z-50 mt-8">
        <div className="px-6 pt-8 pb-6 dark:text-neutral-50 text-4xl font-bold">
          Bond SAM
        </div>
        <div className="flex flex-col px-6 py-2 gap-4 text-left">
          <div className="flex flex-col">
            <p className="dark:text-neutral-50 mb-2">New Bond</p>
            <div className="flex justify-between bg-[#FFF7E7] dark:bg-[#0B122C] border border-app-color dark:border-[#0d183f] border-opacity-20 px-6 py-2 h-[90px]">
              <div className="flex flex-col justify-center items-start w-[calc(100%-80px)]">
                <input
                  name="from"
                  type="number"
                  className="w-full dark:text-neutral-50 font-semibold text-2xl bg-transparent focus-visible:outline-none"
                  placeholder="0.0"
                  value={fromAmount}
                  onChange={handleChange}
                  autoFocus
                ></input>
                <span className="text-gray-400 font-light">
                  ${numberWithCommas(fromAmountInUSD, 6)}
                </span>
              </div>
              <div className="flex flex-col justify-center items-end min-w-[80px]">
                <div className="flex items-center gap-2">
                  <img src="assets/pls.png" alt="pls" width="36" height="36" />
                  <span className="text-app-color text-2xl font-bold">PLS</span>
                </div>
                <span className="text-gray-400 font-light truncate">
                  Balance: {numberWithCommas(ethBalance)}
                </span>
              </div>
            </div>
          </div>
          <div className="flex justify-center">
            <Icon
              icon="mingcute:down-fill"
              className="w-10 h-10 text-white p-2 rounded-full bg-app-color"
            />
          </div>
          <div className="flex flex-col">
            <div className="flex justify-between bg-[#FFF7E7] dark:bg-[#0B122C] border border-app-color dark:border-[#0d183f] border-opacity-20 px-6 py-2 h-[90px]">
              <input
                className="w-[calc(100%-80px)] dark:text-neutral-50 font-semibold text-2xl bg-transparent focus-visible:outline-none"
                placeholder="0.0"
                value={numberWithCommas(toAmount, 4)}
                readOnly
              ></input>
              <div className="flex flex-col justify-center items-end min-w-[80px]">
                <div className="flex items-center gap-2">
                  <img src="assets/sam.png" alt="pls" width="36" height="36" />
                  <span className="text-app-color text-2xl font-bold">SAM</span>
                </div>
                <span className="text-gray-400 font-light truncate">
                  Balance: {numberWithCommas(tokenBalance)}
                </span>
              </div>
            </div>
          </div>
          <div className="flex justify-center gap-2 dark:text-neutral-50">
            <span>1 SAM</span>
            <span>=</span>
            <span className="text-app-color">
              {numberWithCommas(samInPLS, 6)} PLS
            </span>
          </div>
          <div className="flex flex-wrap justify-between">
            {BOND_FREEZE_PERIODS.map((val, index) => (
              <AnimButton
                text={`${val} Days`}
                key={index}
                className="min-w-[120px]"
                active={bondType === index}
                disabled={!bondActivations[index]}
                onClick={() => setBondType(index)}
              />
            ))}
          </div>
        </div>
        <div className="flex flex-col gap-4 px-6 py-6">
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
            disabled={pending && txType === TX_TYPE.BUY}
            onClick={handleBond}
          >
            {pending && txType === TX_TYPE.BUY ? (
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
                {address ? "Get tokens" : "Connect"}
              </span>
            )}
          </Button>
          <div className="flex items-start gap-2">
            <Icon
              icon="fluent:info-24-filled"
              className="w-9 h-9 p-0 text-app-color"
            />
            <p className="text-gray-400 font-extralight text-sm tracking-wide py-2">
              Upon the completion of the vesting period, you will receive{" "}
              <span className="text-app-color font-semibold">+30%</span> in
              tokens to the amount of your initial bond.
            </p>
          </div>
        </div>
      </div>
      {userBond?.bonds?.length > 0 && (
        <div className="rounded-2xl w-full mx-auto mt-8 mb-10 bg-white text-center shadow-card dark:bg-[#161F3E] dark:text-neutral-50 z-50 p-6">
          {userBond?.bonds?.map((bond, index) => {
            const startTime = parseInt(bond.creationTime);
            const endTime =
              parseInt(bond.creationTime) + parseInt(bond.freezePeriod);
            return (
              <div className="block xl:hidden py-2" key={index}>
                <div className="flex flex-col gap-2">
                  <div className="flex justify-between">
                    <span className="text-gray-400 font-extralight">
                      Date of purchase:
                    </span>
                    <span>{formatDateTime(startTime)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400 font-extralight ">
                      SAM Amount:
                    </span>
                    <span>
                      {numberWithCommas(
                        (((fromWei(bond.amount) *
                          (100 + parseInt(bond.profitPercent) / 100)) /
                          100) *
                          tokenReserve) /
                          ethReserve
                      )}{" "}
                      SAM
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400 font-extralight ">
                      PLS Amount:
                    </span>
                    <span>
                      {numberWithCommas(
                        (fromWei(bond.amount) *
                          (100 + parseInt(bond.profitPercent) / 100)) /
                          100
                      )}{" "}
                      PLS
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400 font-extralight ">
                      Locked Until:
                    </span>
                    <span>{formatDateTime(endTime)}</span>
                  </div>
                  {parseInt(bond.stakeAmount) > 0 ? (
                    <div className="flex justify-center">
                      <span className="bg-app-color w-fit px-8 py-1 rounded-full text-white text-center">
                        The bond is staked
                      </span>
                    </div>
                  ) : (
                    <div className="w-full flex gap-2 justify-center items-center">
                      {getUtcNow() / 1000 > endTime ? (
                        <span className="bg-green-400 w-fit px-8 py-1 rounded-full text-white text-center">
                          The bond is closed
                        </span>
                      ) : (
                        <Link
                          to="/staking"
                          className="w-[40%] px-5 py-1 border border-app-color rounded-full text-center font-medium transition hover:text-white hover:bg-app-color"
                        >
                          Stake
                        </Link>
                      )}
                      {/* {getUtcNow() / 1000 > endTime && (
                        <Button
                          variant="outline"
                          sx={{
                            width: "40%",
                            border: "solid 1px #af0cf2",
                            borderRadius: "100px",
                            fontSize: "16px",
                            padding: "2.5px 20px",
                            textTransform: "capitalize",
                            "&:hover": {
                              background: "#af0cf2",
                              color: "white",
                            },
                          }}
                          disabled={pending && txType === TX_TYPE.WITHDRAW}
                          onClick={() => handleSell(index)}
                        >
                          {pending && txType === TX_TYPE.WITHDRAW ? (
                            <div className="flex items-center py-[2px]">
                              <ReactLoading
                                color="#af0cf2"
                                type="spin"
                                width={25}
                                height={25}
                                className="transition"
                              />
                            </div>
                          ) : (
                            <span>Withdraw</span>
                          )}
                        </Button>
                      )} */}
                      <Icon
                        data-tooltip-id="my-tooltip-1"
                        data-tooltip-html="After the bond is completed, the tokens will<br /> be transferred to your availalbe balance!"
                        icon="fluent:info-24-filled"
                        className="w-8 h-8 p-0 text-app-color"
                      />
                      <ReactTooltip id="my-tooltip-1" place="bottom" />
                    </div>
                  )}
                </div>
              </div>
            );
          })}
          {userBond && (
            <div className="hidden xl:flex xl:flex-col xl:gap-3 w-full text-left  px-3">
              <div className="w-full flex py-2">
                <div className="w-2/12 text-gray-400">Date of purchase</div>
                <div className="w-2/12 text-gray-400">SAM amount</div>
                <div className="w-2/12 text-gray-400">PLS amount</div>
                <div className="w-2/12 text-gray-400">Ends in</div>
                <div className="w-4/12"></div>
              </div>
              <Divider />
              {userBond?.bonds?.map((bond, index) => {
                const startTime = parseInt(bond.creationTime);
                const endTime =
                  parseInt(bond.creationTime) + parseInt(bond.freezePeriod);
                return (
                  <div className="flex flex-col gap-2 py-1" key={index * 100}>
                    <div className="flex items-center">
                      <div className="w-2/12">{formatDateTime(startTime)}</div>
                      <div className="w-2/12">
                        {numberWithCommas(
                          (((fromWei(bond.amount) *
                            (100 + parseInt(bond.profitPercent) / 100)) /
                            100) *
                            tokenReserve) /
                            ethReserve
                        )}{" "}
                        SAM
                      </div>
                      <div className="w-2/12">
                        {numberWithCommas(
                          (fromWei(bond.amount) *
                            (100 + parseInt(bond.profitPercent) / 100)) /
                            100
                        )}{" "}
                        PLS
                      </div>
                      <div className="w-2/12">{formatDateTime(endTime)}</div>
                      {parseInt(bond.stakeAmount) > 0 ? (
                        <div className="w-4/12 flex justify-end items-center">
                          <span className="bg-app-color w-fit px-8 py-1 rounded-full text-white text-center">
                            The bond is staked
                          </span>
                        </div>
                      ) : (
                        <div className="w-4/12 flex gap-2 justify-end items-center">
                          {getUtcNow() / 1000 > endTime ? (
                            <span className="bg-green-400 w-fit px-8 py-1 rounded-full text-white text-center">
                              The bond is closed
                            </span>
                          ) : (
                            <Link
                              to="/staking"
                              className="w-28 px-5 py-1 border border-app-color rounded-full text-center font-medium transition hover:text-white hover:bg-app-color"
                            >
                              Stake
                            </Link>
                          )}
                          {/* {getUtcNow() / 1000 > endTime && (
                            <Button
                              variant="outline"
                              sx={{
                                width: "112px",
                                border: "solid 1px #af0cf2",
                                borderRadius: "100px",
                                fontSize: "16px",
                                padding: "1.5px 20px",
                                textTransform: "capitalize",
                                "&:hover": {
                                  background: "#af0cf2",
                                  color: "white",
                                },
                              }}
                              disabled={pending && txType === TX_TYPE.WITHDRAW}
                              onClick={() => handleSell(index)}
                            >
                              {pending && txType === TX_TYPE.WITHDRAW ? (
                                <div className="flex items-center py-[2px]">
                                  <ReactLoading
                                    color="#af0cf2"
                                    type="spin"
                                    width={25}
                                    height={25}
                                    className="transition"
                                  />
                                </div>
                              ) : (
                                <span>Withdraw</span>
                              )}
                            </Button>
                          )} */}
                          <Icon
                            data-tooltip-id="my-tooltip-2"
                            data-tooltip-html="After the bond is completed, the tokens will<br /> be transferred to your availalbe balance!"
                            icon="fluent:info-24-filled"
                            className="w-8 h-8 p-0 text-app-color"
                          />
                          <ReactTooltip
                            id="my-tooltip-2"
                            place="bottom"
                            className="w-60"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Bonding;
