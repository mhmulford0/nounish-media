import "./polyfills";
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";

import "./index.css";
import "@rainbow-me/rainbowkit/styles.css";

import {
  darkTheme,
  getDefaultWallets,
  RainbowKitProvider,
} from "@rainbow-me/rainbowkit";
import { configureChains, createConfig, WagmiConfig } from "wagmi";
import { mainnet } from "wagmi/chains";
import { alchemyProvider } from "wagmi/providers/alchemy";

if (!import.meta.env.VITE_ALCHEMY_ID) {
  throw new Error("alchemy api key required");
}

if (!import.meta.env.VITE_API_URL) {
  throw new Error("API URL required");
}

const { chains, publicClient } = configureChains(
  [mainnet],
  [alchemyProvider({ apiKey: import.meta.env.VITE_ALCHEMY_ID })]
);

const { connectors } = getDefaultWallets({
  appName: "Nounish Media",
  projectId: "dd78716fb7c73961f4f3fede8139b615",
  chains,
});

const wagmiConfig = createConfig({
  autoConnect: true,
  connectors,
  publicClient,
});

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <WagmiConfig config={wagmiConfig}>
      <RainbowKitProvider chains={chains} theme={darkTheme()}>
        <App />
      </RainbowKitProvider>
    </WagmiConfig>
  </React.StrictMode>
);
