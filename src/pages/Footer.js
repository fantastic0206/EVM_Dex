import { Icon } from "@iconify/react";
import { toast } from 'react-toastify';

const Footer = () => {
  const onLoading = () => {
    toast.warn("Our contracts are under the audit. Waiting for report.")
  }
  return (
    <div className="container mx-auto w-full flex flex-col lg:flex-row gap-3 justify-between items-center z-50 px-8 py-4">
      <div className="flex flex-col items-center lg:items-start">
        <img src="assets/logo3.png" width="130" alt="logo" />
        <span className="text-white">Copyright@ 2023</span>
      </div>
      <div className="flex flex-wrap gap-3 justify-center">
        <a href="https://x.com/sam_finance365?s=21&t=u_1dFHKgi4dKkz3oRxt-HQ" target="_blank" rel="noreferrer">
          <Icon
            icon="pajamas:twitter"
            className="w-10 h-10 text-white hover:text-app-color border border-white hover:border-app-color transition cursor-pointer p-1 rounded-full"
          />
        </a>
        <a
          href="https://t.me/samuelplsofficial"
          target="_blank"
          rel="noreferrer"
        >
          <Icon
            icon="basil:telegram-outline"
            className="w-10 h-10 text-white hover:text-app-color border border-white hover:border-app-color transition cursor-pointer p-1 rounded-full"
          />
        </a>
        {/* <a href="#" target="_blank" rel="noreferrer">
          <Icon
            icon="radix-icons:discord-logo"
            className="w-10 h-10 text-white hover:text-app-color border border-white hover:border-app-color transition cursor-pointer p-1 rounded-full"
          />
        </a> */}
        <a href="https://samprotocol.gitbook.io/doc/" target="_blank" rel="noreferrer">
          <Icon
            icon="simple-icons:gitbook"
            className="w-10 h-10 text-white hover:text-app-color border border-white hover:border-app-color transition cursor-pointer p-1 rounded-full"
          />
        </a>
        <a href="https://github.com/SpyWolfNetwork/Smart_Contract_Audits/blob/main/November_2023/SAM_PROTOCOL_0xC4BBe5A95C1bEEd931A586B70Df0b080c5be438b.pdf" target="_blank" rel="noreferrer">
          <Icon
            icon="basil:search-solid"
            className="w-10 h-10 text-white hover:text-app-color border border-white hover:border-app-color transition cursor-pointer p-1 rounded-full"
          />
        </a>
      </div>
    </div>
  );
};

export default Footer;
