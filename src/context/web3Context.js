import { createContext, useContext } from "react";
import { useSigningWeb3Client } from "./web3Hook";

export const Web3Context = createContext();

export const Web3Provider = ({ children }) => {
  const contextValue = useSigningWeb3Client();

  return <Web3Context.Provider value={contextValue}>
    {children}
  </Web3Context.Provider>
}

const useWeb3Context = () => {
  return useContext(Web3Context);
};

export default useWeb3Context;