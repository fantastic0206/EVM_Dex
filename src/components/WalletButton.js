import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useMediaQuery } from "@mui/material";


const WalletButton = () => {
  const isSmallMobile = useMediaQuery('(max-width:767px)');
  return (
    <ConnectButton.Custom>
      {({
        account,
        chain,
        openAccountModal,
        openChainModal,
        openConnectModal,
        authenticationStatus,
        mounted,
      }) => {
        // Note: If your app doesn't use authentication, you
        // can remove all 'authenticationStatus' checks
        const ready = mounted && authenticationStatus !== "loading";
        const connected =
          ready &&
          account &&
          chain &&
          (!authenticationStatus || authenticationStatus === "authenticated");

        return (
          <div
            {...(!ready && {
              "aria-hidden": true,
              style: {
                opacity: 0,
                pointerEvents: "none",
                userSelect: "none",
              },
            })}
          >
            {(() => {
              if (!connected) {
                return (
                  <button
                    onClick={openConnectModal}
                    type="button"
                    className="text-auxi-color border border-auxi-color bg-white rounded-full h-10 min-h-[40px] px-4 truncate"
                  >
                    Connect Wallet
                  </button>
                );
              }

              if (chain.unsupported) {
                return (
                  <button
                    onClick={openChainModal}
                    type="button"
                    className="text-red-500 border border-red-500 bg-white rounded-full h-10 min-h-[40px] px-4 truncate"
                  >
                    Wrong network
                  </button>
                );
              }

              return (
                <div style={{ display: "flex", gap: 12 }}>
                  <button
                    onClick={openChainModal}
                    className="flex items-center bg-white rounded-full px-2 py-2 gap-2 md:px-4 border border-auxi-color md:border-none"
                    type="button"
                  >
                    {chain.hasIcon && (
                      <div
                        style={{
                          background: chain.iconBackground,
                          width: 24,
                          height: 24,
                          borderRadius: 999,
                          overflow: "hidden",
                        }}
                      >
                        {chain.iconUrl && (
                          <img
                            alt={chain.name ?? "Chain icon"}
                            src={chain.iconUrl}
                            style={{ width: 24, height: 24 }}
                          />
                        )}
                      </div>
                    )}
                    {!isSmallMobile && (
                      <span className="text-auxi-color truncate">
                        {chain.name}
                      </span>
                    )}
                  </button>

                  <button
                    onClick={openAccountModal}
                    type="button"
                    className="truncate text-auxi-color bg-white rounded-full h-10 min-h-[40px] px-4"
                  >
                    {account.displayName}
                    {(account.displayBalance && !isSmallMobile)
                      ? ` (${account.displayBalance})`
                      : ""}
                  </button>
                </div>
              );
            })()}
          </div>
        );
      }}
    </ConnectButton.Custom>
  );
};

export default WalletButton;
