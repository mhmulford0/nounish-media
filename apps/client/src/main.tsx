import "./polyfills";
import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

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
import HomePage from "./pages/homePage";
import UploadsPage from "./pages/uploads";
import Layout from "./components/Layout";

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

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <Layout>
        <HomePage />
      </Layout>
    ),
  },
  {
    path: "/uploads",
    element: (
      <Layout>
        <UploadsPage />
      </Layout>
    ),
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <WagmiConfig config={wagmiConfig}>
      <RainbowKitProvider chains={chains} theme={darkTheme()}>
        <RouterProvider router={router} />
      </RainbowKitProvider>
    </WagmiConfig>
  </React.StrictMode>
);
