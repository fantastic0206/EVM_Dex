import { useEffect, useMemo, useState } from "react";
import Modal from "@mui/material/Modal";
import Button from "@mui/material/Button";
import { IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import useWeb3Context from "@context/web3Context";
import ReactLoading from "react-loading";
import Divider from "@components/Divider";
import SelButton from "@components/SelButton";
import { TX_TYPE } from "@utils/constants";
import { toast } from "react-toastify";
import { numberWithCommas } from "@utils/utils";

const ClaimModal = ({ open, onClose }) => {
  const [perc, setPerc] = useState(0);
  const [fromAmount, setFromAmount] = useState("");

  useEffect(() => {
    setFromAmount("");
    setPerc(0);
  }, [open]);

  const { pending, txType, address, userData, claim } = useWeb3Context();

  const handleChange = (e) => {
    const newValue = e.target.value;
    setFromAmount(newValue === "" ? "" : Number(newValue));
  };

  const handlePerc = (v) => {
    setPerc(v);
    if (userData?.userAvailableAmount) {
      const value = parseInt(userData?.userAvailableAmount * v * 10 ** 2) / 10 ** 4;
      setFromAmount(value);
    } else {
      setFromAmount(0);
    }
  };

  const handleClaim = async () => {
    if (!address) {
      toast.warn("Please connect wallet");
      return;
    }
    const availalbe = userData?.userAvailableAmount
      ? userData?.userAvailableAmount
      : 0;
    if (fromAmount > availalbe && userData?.userAvailableAmount > 0) {
      toast.warn("Claim: Insufficient balance");
      return;
    }
    await claim(fromAmount);
    onClose();
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      disableEnforceFocus
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-[500px] bg-white shadow-card dark:bg-[#161F3E] rounded-2xl px-8 py-6">
        <div className="flex flex-col">
          <div className="flex justify-between items-center mb-3">
            <span className="text-2xl dark:text-neutral-50">Claim SAM</span>
            <IconButton onClick={onClose}>
              <CloseIcon
                sx={{
                  border: "solid 2px gray",
                  borderRadius: "100px",
                  opacity: "80%",
                  color: "gray",
                  fontSize: "28px",
                }}
              />
            </IconButton>
          </div>
          <Divider />
          <div className="flex flex-col gap-4 text-left mt-5">
            <div className="flex flex-col">
              <p className="dark:text-neutral-50 mb-2">New Claim (SAM)</p>
              <div className="flex justify-between bg-[#FFF7E7] dark:bg-[#0B122C] border border-app-color dark:border-[#0d183f] border-opacity-20 px-6 py-2 h-[88px]">
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
                  <span className="text-gray-400 font-light"></span>
                </div>
                <div className="flex flex-col justify-center items-end min-w-[80px]">
                  <div className="flex items-center gap-2">
                    <img
                      src="assets/sam.png"
                      alt="sam"
                      width="36"
                      height="36"
                    />
                    <span className="text-app-color text-2xl font-bold">
                      SAM
                    </span>
                  </div>
                  <span className="text-gray-400 font-light truncate">
                    Available:{" "}
                    {userData?.userAvailableAmount
                      ? numberWithCommas(userData?.userAvailableAmount)
                      : 0}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex flex-wrap justify-between">
              <SelButton
                text="10%"
                active={perc === 10}
                onClick={() => handlePerc(10)}
              />
              <SelButton
                text="25%"
                active={perc === 25}
                onClick={() => handlePerc(25)}
              />
              <SelButton
                text="50%"
                active={perc === 50}
                onClick={() => handlePerc(50)}
              />
              <SelButton
                text="Max"
                active={perc === 100}
                onClick={() => handlePerc(100)}
              />
            </div>
            <div className="flex justify-center items-center gap-2">
              <span className="dark:text-neutral-50">
                After tokens are claimed you won't be able to rebond them.
              </span>
            </div>
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
                (pending || Number(fromAmount) === 0) &&
                txType === TX_TYPE.CLAIM
              }
              onClick={handleClaim}
            >
              {pending && txType === TX_TYPE.CLAIM ? (
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
                  {address ? "Claim" : "Connect"}
                </span>
              )}
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default ClaimModal;
