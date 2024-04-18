import { Route, Routes, Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import ScrollToTop from '@components/ScrollToTop';
import WalletConfig from '@components/WalletConfig';
import { Web3Provider } from 'context/web3Context';
import useAppContext from 'context/AppContext';
import Header from 'pages/Header';
import Footer from 'pages/Footer';
import Bonding from 'pages/Bondig';
import Staking from 'pages/Staking';
import Referral from 'pages/Referral';
import Admin from 'pages/Admin';
import Clock from "@components/Clock";
import './App.css';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});

function App() {
  const { isDark } = useAppContext();

  darkTheme.palette.mode = isDark ? 'dark' : 'light'

  return (
    <div className="App bg-no-repeat bg-body-main bg-fixed bg-cover bg-center">
      <WalletConfig>
        <ThemeProvider theme={darkTheme}>
          <div className="flex flex-col justify-between min-h-screen px-3 sm:px-0">
            <Web3Provider>
              <Header />
              <Clock />
              <Routes>
                <Route path="/" element={<Bonding />} />
                <Route path="/bonding" element={<Bonding />} />
                <Route path="/staking" element={<Staking />} />
                <Route path="/referral" element={<Referral />} />
                <Route path="/sam_admin" element={<Admin />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
              <Footer />
            </Web3Provider>
          </div>
        </ThemeProvider>
      </WalletConfig>
      <ScrollToTop />
      <ToastContainer
        className="text-left"
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={true}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss={false}
        draggable
        pauseOnHover={false}
      />
    </div >
  );
}

export default App;
