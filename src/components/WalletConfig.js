import { WagmiConfig, createConfig, configureChains } from 'wagmi'
import {
  pulsechain,
  pulsechainV4
} from 'wagmi/chains';
import { alchemyProvider } from 'wagmi/providers/alchemy'
import { infuraProvider } from 'wagmi/providers/infura'
import { publicProvider } from 'wagmi/providers/public'
import '@rainbow-me/rainbowkit/styles.css';
import {
  connectorsForWallets,
  RainbowKitProvider,
  lightTheme,
  darkTheme,
} from '@rainbow-me/rainbowkit';
import {
  metaMaskWallet,
  coinbaseWallet,
  rainbowWallet,
  trustWallet,
  walletConnectWallet,
  okxWallet,
} from "@rainbow-me/rainbowkit/wallets";
import merge from 'lodash.merge';
import useAppContext from 'context/AppContext';
import { CONFIG } from '../utils/config';

// Configure chains & providers with the Alchemy provider.
// Two popular providers are Alchemy (alchemy.com) and Infura (infura.io)
const pulseChain = { 
  ...pulsechain, 
  rpcUrls: {
    default: {
      http: ['https://rpc.pulsechain.com'],
      webSocket: ['wss://rpc.pulsechain.com'],
    },
    public: {
      http: ['https://rpc.pulsechain.com'],
      webSocket: ['wss://rpc.pulsechain.com'],
    },
  },
  iconUrl: "https://scan.v4.testnet.pulsechain.com/images/LogoVector-2d361e2f2fc7e4c5ca37fc4f92340781.svg?vsn=d" 
};
const pulseChainV4 = { 
  ...pulsechainV4, 
  rpcUrls: {
    default: {
      http: ['https://pulsechain-testnet.publicnode.com'],
      webSocket: ['wss://ws.v4.testnet.pulsechain.com'],
    },
    public: {
      http: ['https://pulsechain-testnet.publicnode.com'],
      webSocket: ['wss://ws.v4.testnet.pulsechain.com'],
    },
  },
  iconUrl: "https://scan.v4.testnet.pulsechain.com/images/LogoVector-2d361e2f2fc7e4c5ca37fc4f92340781.svg?vsn=d" 
};
const { chains, publicClient, webSocketPublicClient } = configureChains(
  [pulseChain],
  [
    alchemyProvider({ apiKey: CONFIG.ALCHEMY_APIKEY }),
    infuraProvider({ apiKey: CONFIG.INFURA_APIKEY }),
    publicProvider()],
)

const projectId = "66d67995d2b969a5dc56f5cdba64721f";
const appName = "sam_test";

const connectors = connectorsForWallets([
  {
    groupName: "Wallets",
    wallets: [
      metaMaskWallet({ chains, projectId }),
      coinbaseWallet({ appName, chains, projectId }),
      rainbowWallet({ chains, projectId }),
      trustWallet({ projectId, chains }),
      walletConnectWallet({ chains, projectId }),
      okxWallet({ chains, projectId })
    ],
  },
]);

// Set up wagmi config
const wagmiConfig = createConfig({
  autoConnect: true,
  connectors,
  publicClient,
  webSocketPublicClient
})

const customDarkTheme = merge(darkTheme(), {
  colors: {
    modalBackground: '#161F3E'
  }
})

export default function WalletConfig({ children }) {
  const { isDark } = useAppContext();
  return (
    <WagmiConfig
      config={wagmiConfig}
    >
      <RainbowKitProvider
        chains={chains}
        theme={isDark ? customDarkTheme : lightTheme()}
        modalSize="wide"
        coolMode={true}
      >
        {children}
      </RainbowKitProvider>
    </WagmiConfig>
  )
}