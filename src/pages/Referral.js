import { Icon } from '@iconify/react';
import IconButton from '@mui/material/IconButton';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import Divider from '@mui/material/Divider';
import useWeb3Context from '@context/web3Context';
import { copyToClipboard, numberWithCommas } from '@utils/utils';
import { toast } from 'react-toastify';

const Referral = () => {
  const { address, userData } = useWeb3Context();

  const handleCopyRef = () => {
    if (address) {
      const data = window.location.origin + "?ref=" + address;
      copyToClipboard(data)
      toast.success("Successfully copied the referral link.")
    } else {
      toast.warn("Please connect the wallet.")
    }
  }

  return (
    <div className="flex flex-col container mx-auto z-50 dark:text-neutral-50 mb-auto">
      <div className="px-6 pt-8 pb-6 text-4xl font-bold text-white">
        Referral Program
      </div>
      <div className="flex flex-col lg:flex-row w-full h-full gap-3">
        <div className="w-full lg:w-3/5">
          <div className="flex flex-col justify-between gap-4 rounded-2xl w-full h-full mx-auto bg-white text-center dark:bg-[#161F3E] shadow-card px-6 py-6">
            <span className="text-left">Your link</span>
            <div className="relative w-full border border-app-color bg-[#FFF7E7] dark:bg-[#0B122C] dark:border-[#0d183f] h-10 px-3">
              <input className="w-full h-full pr-6 bg-transparent outline-none truncate" placeholder={`${window.location.origin}?ref=${address ? address : "0x..."}`}></input>
              <div className="absolute top-0 right-0">
                <IconButton onClick={handleCopyRef}>
                  <ContentCopyIcon className="text-app-color" />
                </IconButton>
              </div>
            </div>
            <Divider />
            <div className="flex flex-col gap-3">
              <div className="flex gap-2 text-left">
                <Icon icon="iconamoon:check-bold" className='w-7 h-7 text-app-color' />
                <span className='text-sm tracking-wide font-light'>5% from direct referrals</span>
              </div>
              <div className="flex gap-2 text-left">
                <Icon icon="iconamoon:check-bold" className='w-7 h-7 text-app-color' />
                <span className='text-sm tracking-wide font-light'>You will receive the reward in PLS directly to your wallet.</span>
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col justify-between gap-4 rounded-2xl w-full lg:w-2/5 h-full mx-auto bg-white text-center dark:bg-[#161F3E] shadow-card px-6 py-6">
          <span className="mt-3 text-left ">Your statistics</span>
          <span className="text-5xl">{ userData?.totalRefReward > 0 ? numberWithCommas(userData?.totalRefReward, 4) : "0.0000"}</span>
          <span className="text-3xl">PLS</span>
          {/* <div className="flex justify-between items-center">
            <div className="flex gap-2">
              <span>Your Level</span>
              <Icon
                data-tooltip-id="my-tooltip-3"
                data-tooltip-html="The initial level of incentive program yield is 5% and can be increased up to 20% if you contribute significantly to the TVL of the protocol."
                icon="ci:info"
                className="w-6 h-6 p-0 "
              />
              <ReactTooltip
                id="my-tooltip-3"
                place="bottom"
              />
            </div>
            <span className="font-bold ">5%</span>
          </div>
          <div className="flex justify-between items-center">
            <div className="flex gap-2">
              <span>TVL from 5 lines</span>
              <Icon
                data-tooltip-id="my-tooltip-3"
                data-tooltip-html="All TVL generated from your recommendations up to 5 levels deep will be taken into account. Based on the total TVL, you will be assigned a level in the incentive program."
                icon="ci:info"
                className="w-6 h-6 p-0 "
              />
              <ReactTooltip
                id="my-tooltip-3"
                place="bottom"
              />
            </div>
            <span className="font-bold ">0.000000 PLS</span>
          </div> */}
          <div className="flex justify-between items-center">
            <span>Number of invited</span>
            <span className="font-bold">{userData?.referralsNumber > 0 ? numberWithCommas(userData?.referralsNumber) : "0"}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Referral;