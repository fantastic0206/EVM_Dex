import { createContext, useState, useEffect, useContext } from "react";
import axios from 'axios';
import { API } from "@utils/config";

export const ApiContext = createContext();

export const ApiProvider = ({ children }) => {
  const [pricePLS, setPricePLS] = useState(0);

  useEffect(() => {
    getPricesInUSD();
    const intVal = setInterval(() => {
      getPricesInUSD();
    }, 5 * 60 * 1000); // 5 mins
    return (() => clearInterval(intVal))
  }, [])

  const getPricesInUSD = async () => {
    try {
      const res = (await axios.get(API.PRICE)).data;
      setPricePLS(res?.PLS);
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <ApiContext.Provider
      value={{
        pricePLS
      }}>
      {children}
    </ApiContext.Provider>
  );
};

const useApiContext = () => {
  return useContext(ApiContext);
};

export default useApiContext;