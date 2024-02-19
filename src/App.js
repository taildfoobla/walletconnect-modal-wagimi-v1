import React, { useEffect } from "react"
// import {createWeb3Modal, defaultWagmiConfig} from "@web3modal/wagmi/dist/esm/exports/react"
import { createWeb3Modal } from "@web3modal/wagmi/react"
import {
    arbitrum,
    avalanche,
    bsc,
    fantom,
    gnosis,
    mainnet,
    optimism,
    polygon,
    moonbaseAlpha,
    baseGoerli,
} from "wagmi/chains"
import {walletConnectProvider, EIP6963Connector} from "@web3modal/wagmi"
import {WalletConnectModal} from "@walletconnect/modal"

import {WagmiConfig, configureChains, createConfig} from "wagmi"
import {publicProvider} from "wagmi/providers/public"
import {CoinbaseWalletConnector} from "wagmi/connectors/coinbaseWallet"
import {InjectedConnector} from "wagmi/connectors/injected"
import {WalletConnectConnector} from "wagmi/connectors/walletConnect"



export const chainsA = [mainnet, polygon, avalanche, arbitrum, bsc, optimism, gnosis, fantom, moonbaseAlpha, baseGoerli]
const projectId = "2d6d4341d352937d613828ea6124a208"


const metadata = {
    name: "MoonFit - Web3 & NFT Lifestyle App",
    description:
        "MoonFit is a Web3 & NFT lifestyle app that promotes active living by rewarding users anytime they burn calories through physical activities.",
    url: "https://app.moonfit.xyz",
    icons: ["https://prod-cdn.moonfit.xyz/image/original/assets/images/preview/web-preview_1.png"],
}

const {chains, publicClient} = configureChains(chainsA, [walletConnectProvider({projectId}), publicProvider()])

const wagmiConfig = createConfig({
    autoConnect: true,
    connectors: [
        new WalletConnectConnector({chains, options: {projectId, showQrModal: false, metadata}}),
        new EIP6963Connector({chains}),
        new InjectedConnector({chains, options: {shimDisconnect: true}}),
        new CoinbaseWalletConnector({chains, options: {appName: metadata.name}}),
    ],
    publicClient,
})

createWeb3Modal({
    wagmiConfig,
    projectId,
    chains,
    enableAnalytics: true, // Optional - defaults to your Cloud configuration
})

function App() {

    return (
        <WagmiConfig config={wagmiConfig}>
            <w3m-button/>
        </WagmiConfig>
    )
}


export default App
