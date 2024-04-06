import '@rainbow-me/rainbowkit/styles.css';

import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';

import {
  getDefaultConfig,
  RainbowKitProvider,
} from '@rainbow-me/rainbowkit';
import { WagmiProvider } from 'wagmi';
import {
  polygonMumbai,
  xdcTestnet,
  sepolia,
} from 'wagmi/chains';
import {
  QueryClientProvider,
  QueryClient,
} from "@tanstack/react-query";
import Home from './pages/Home';
import Navbar from './component/Navbar';
import CreatePatent from './pages/CreatePatent';
import Patents from './pages/Patents';

const config = getDefaultConfig({
  appName: 'Patent',
  projectId: 'YOUR_PROJECT_ID',
  chains: [polygonMumbai, xdcTestnet, sepolia],
  ssr: true, // If your dApp uses server side rendering (SSR)
});

const queryClient = new QueryClient();


function App() {
  return (
    <div>
      <WagmiProvider config={config}>
        <QueryClientProvider client={queryClient}>
         <RainbowKitProvider>
           <Router>
            <Navbar />
            <Routes>
              <Route path='/' element={<Home />} />
              <Route path='/Createpatent' element={<CreatePatent />} />
              <Route path='/Patents' element={<Patents />} />
            </Routes>
           </Router>
          </RainbowKitProvider>
        </QueryClientProvider>
      </WagmiProvider>
    </div>
  );
}

export default App;
