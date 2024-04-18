import { useEffect, useState } from "react";
import Button from "@mui/material/Button";
import ReactLoading from "react-loading";
import { toast } from "react-toastify";
import useWeb3Context from "@context/web3Context";
import { numberWithCommas, isValidAddress } from "@utils/utils";
import { TX_TYPE } from "@utils/constants";
import { CONFIG } from "@utils/config";

const Admin = () => {
  const [destAddress, setDestAddress] = useState("");
  const [amount, setAmount] = useState(0);
  const [balance, setBalance] = useState(0);
  const {
    pending,
    address,
    owner,
    txType,
    tokenToCoin,
    tokenToUsd,
    getTokenBalanceByAddress,
    influencerBond,
  } = useWeb3Context();

  useEffect(() => {
    (async () => {
      const value = await getTokenBalanceByAddress(CONFIG.PROTOCOL_CONTRACT);
      setBalance(value);
    })();
  }, [address]);

  const handleChange = (e) => {
    if (e.target.name === "amount") {
      setAmount(e.target.value);
    } else {
      setDestAddress(e.target.value);
    }
  };

  const handleBond = async () => {
    if (!isValidAddress(destAddress)) {
      toast.warn("Please input the valid address");
      return;
    }
    if (owner !== address) {
      toast.error("Only owner can handle it.");
      return;
    }
    if (amount > balance) {
      toast.warn("Please input the correct amount");
      return;
    }
    await influencerBond(destAddress, amount);
    const value = await getTokenBalanceByAddress(CONFIG.PROTOCOL_CONTRACT);
    setBalance(value);
  };

  return (
    <div className="container mx-auto px-4 sm:px-8">
      <div className="block rounded-2xl w-full max-w-[600px] mx-auto bg-white text-center shadow-card dark:bg-[#161F3E] z-50 mt-8 py-10">
        <div className="px-6 pt-2 pb-3 dark:text-neutral-50 text-4xl font-bold">
          Admin Panel
        </div>
        <p className="mb-3">Only owner can handle the operation.</p>
        <div className="flex flex-col px-6 py-2 gap-4 text-left">
          <div className="flex flex-col gap-3">
            <p className="dark:text-neutral-50">Influencer Bond</p>
            <div className="flex justify-between bg-[#FFF7E7] dark:bg-[#0B122C] border border-app-color dark:border-[#0d183f] border-opacity-20 px-6 py-2">
              <input
                name="destinate"
                className="w-full dark:text-neutral-50 font-semibold text-2xl bg-transparent focus-visible:outline-none"
                placeholder="0x0123456789..."
                value={destAddress}
                onChange={handleChange}
                autoFocus
              ></input>
            </div>
            <div className="flex justify-between bg-[#FFF7E7] dark:bg-[#0B122C] border border-app-color dark:border-[#0d183f] border-opacity-20 px-6 py-2 h-[90px]">
              <div className="flex flex-col justify-center items-start w-[calc(100%-80px)]">
                <input
                  name="amount"
                  type="number"
                  className="w-full dark:text-neutral-50 font-semibold text-2xl bg-transparent focus-visible:outline-none"
                  placeholder="0.0"
                  value={amount}
                  onChange={handleChange}
                  autoFocus
                ></input>
                <span className="text-gray-400 font-light">
                  ${numberWithCommas(tokenToUsd(tokenToCoin(amount)), 6)}
                </span>
              </div>
              <div className="flex flex-col justify-center items-end min-w-[80px]">
                <div className="flex items-center gap-2">
                  <img src="assets/sam.png" alt="sam" width="36" height="36" />
                  <span className="text-app-color text-2xl font-bold">SAM</span>
                </div>
                <span className="text-gray-400 font-light truncate">
                  Available: {numberWithCommas(balance)}
                </span>
              </div>
            </div>
            <div className="mt-5">
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
                disabled={
                  (pending && txType === TX_TYPE.FREE_BOND) || owner !== address
                }
                onClick={handleBond}
              >
                {pending && txType === TX_TYPE.FREE_BOND ? (
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
                  <span className="text-white">Send</span>
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Admin;
