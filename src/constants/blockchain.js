import configs from '../configs'
import MetaMaskLogo from '../assets/images/wallets/MetaMaskLogo.svg';
import SubWalletLogo from '../assets/images/wallets/SubWalletLogo.svg';
import WalletConnectLogo from '../assets/images/wallets/WalletConnectLogo.svg';

export const WEB3_METHODS = {
    requestAccounts: {
        method: 'eth_requestAccounts'
    },
    addMoonbeamNetwork: {
        method: 'wallet_addEthereumChain',
        params: [
            {
                chainId: '0x504',
                rpcUrls: ['https://rpc.api.moonbeam.network'],
                chainName: 'Moonbeam',
                nativeCurrency: {name: 'GLMR', decimals: 18, symbol: 'GLMR'},
                blockExplorerUrls: ['https://moonbeam.moonscan.io/']
            }
        ]
    },
    switchToMoonbeamNetwork: {
        method: 'wallet_switchEthereumChain',
        params: [
            {
                chainId: '0x504'
            }
        ]
    },
    addMoonriverNetwork: {
        method: 'wallet_addEthereumChain',
        params: [
            {
                chainId: '0x505',
                rpcUrls: ['https://rpc.api.moonriver.moonbeam.network'],
                chainName: 'Moonriver',
                nativeCurrency: {name: 'MOVR', decimals: 18, symbol: 'MOVR'},
                blockExplorerUrls: ['https://moonriver.moonscan.io/']
            }
        ]
    },
    switchToMoonriverNetwork: {
        method: 'wallet_switchEthereumChain',
        params: [
            {
                chainId: '0x505'
            }
        ]
    },
    addMoonbaseAlphaNetwork: {
        method: 'wallet_addEthereumChain',
        params: [
            {
                chainId: '0x507',
                rpcUrls: ['https://rpc.api.moonbase.moonbeam.network'],
                chainName: 'MoonbaseAlpha',
                nativeCurrency: {name: 'DEV', decimals: 18, symbol: 'DEV'},
                blockExplorerUrls: ['https://moonbase.moonscan.io/']
            }
        ]
    },
    switchToMoonbaseAlphaNetwork: {
        method: 'wallet_switchEthereumChain',
        params: [
            {
                chainId: '0x507'
            }
        ]
    },
    addAstarNetwork: {
        method: 'wallet_addEthereumChain',
        params: [
            {
                chainId: '0x250',
                rpcUrls: ['https://evm.shibuya.astar.network'],
                chainName: 'Astar',
                nativeCurrency: {name: 'ASTR', decimals: 18, symbol: 'ASTR'},
                blockExplorerUrls: ['https://blockscout.com/astar']
            }
        ]
    },
    switchToAstarNetwork: {
        method: 'wallet_switchEthereumChain',
        params: [
            {
                chainId: '0x250' // 592
            }
        ]
    },
    addShidenNetwork: {
        method: 'wallet_addEthereumChain',
        params: [
            {
                chainId: '0x150', // 336
                rpcUrls: ['https://evm.shibuya.astar.network'],
                chainName: 'Shiden',
                nativeCurrency: {name: 'SDN', decimals: 18, symbol: 'SDN'},
                blockExplorerUrls: ['https://blockscout.com/astar']
            }
        ]
    },
    switchToShidenNetwork: {
        method: 'wallet_switchEthereumChain',
        params: [
            {
                chainId: '0x150'
            }
        ]
    },
    addShibuyaNetwork: {
        method: 'wallet_addEthereumChain',
        params: [
            {
                chainId: '0x51',
                rpcUrls: ['https://evm.shibuya.astar.network'],
                chainName: 'Shibuya Testnet',
                nativeCurrency: {name: 'SBY', decimals: 18, symbol: 'SBY'},
                blockExplorerUrls: ['https://blockscout.com/shibuya']
            }
        ]
    },
    switchToShibuyaNetwork: {
        method: 'wallet_switchEthereumChain',
        params: [
            {
                chainId: '0x51' // 81
            }
        ]
    },
    getPermissions: {
        method: 'wallet_getPermissions',
        params: [{eth_accounts: {}}]
    },
    requestPermissions: {
        method: 'wallet_requestPermissions',
        params: [{eth_accounts: {}}]
    }
}

export const CHAIN_ID_MAPPING = {
    '0x507': 'Moonbase Alpha',
    '507': 'Moonbase Alpha',
    '1287': 'Moonbase Alpha',
    '0x504': 'Moonbeam',
    '504': 'Moonbeam',
    '1284': 'Moonbeam',
}

export const PROVIDER_NAME = {
    SubWallet: "SubWallet",
    MetaMask: "ethereum"
}

export const EVM_WALLETS = [
    {
        extensionName: 'SubWallet',
        title: 'SubWallet (EVM)',
        installUrl: 'https://subwallet.app/download.html',
        logo: {
            src: SubWalletLogo ,
            alt: 'SubWallet (EVM)'
        },
        isSetGlobalString: 'isSubWallet',
        initEvent: 'subwallet#initialized',
        isMobileSupport: true
    },
    {
        extensionName: 'ethereum',
        title: 'MetaMask',
        installUrl: 'https://metamask.io/download/',
        logo: {
            src: MetaMaskLogo,
            alt: 'MetaMask Extension'
        },
        isSetGlobalString: 'isMetaMask',
        initEvent: 'ethereum#initialized',
        isMobileSupport: true
    }
];

export const WALLET_CONNECT = {
    title: 'Wallet Connect',
    logo: {
        src: WalletConnectLogo,
        alt: 'Wallet Connect'
    },
}

const isDev = configs.env === 'development'

export const NFT_SALE_ROUNDS_INFO = {
    R1: {
        index: 1,
        number: 1,
        title: 'NFT Sale 1',
        timelineTitle: 'Whitelist Sale #1',
        isSoldOut: true,
        activeSoldOut: false,
        soldOutMsg: 'Sold out in 30 minutes',
        fromTokenID: 1,
        amount: 500,
        price: 79,
        mintPass: 1,
        nftPerPass: 1,
        description: '',
        dateMsg: '22nd August',
        time: 1661176800000, // Date and time (GMT): Monday, August 22, 2022 2:00:00 PM
        specialRound: false
    },
    R2: {
        index: 2,
        number: 2,
        title: 'NFT Sale 2',
        timelineTitle: 'Whitelist Sale #2',
        isSoldOut: true,
        activeSoldOut: false,
        NFT_SALE_SC: configs.R2_NFT_SALE_SC,
        amount: 1500,
        fromTokenID: 501,
        price: 119,
        mintPass: 1,
        nftPerPass: 2,
        description: 'Buy max 2 MoonBeasts per MintPass',
        dateMsg: '24th September',
        time: 1664028000000, // Date and time (GMT): Saturday, September 24, 2022 2:00:00 PM,
        specialRound: false
    },
    WC: {
        index: 3,
        number: 5,
        headerTitle: 'World cup 2022',
        title: 'SPECIAL EDITION',
        timelineTitle: 'World cup Sale',
        isSoldOut: true,
        activeSoldOut: false,
        NFT_SALE_SC: configs.WC_NFT_SALE_SC,
        amount: 19,
        fromTokenID: 2001,
        price: 399,
        mintPass: 0,
        nftPerPass: null,
        description: 'No MintPass required',
        dateMsg: '25th November',
        // expireDate: '2022-12-12',
        dateRange: 'nov 25 - dec 12',
        eventUpdateSaleAmountName: 'WorldCupUpdateSaleAmount',
        time: 1665583200000, // Date and time (GMT): Wednesday, October 12, 2022 2:00:00 PM
        ...(isDev ? {
            time: Date.now(),
            price: 0.00399,
        } : {}),
        specialRound: true
    },
    R3: {
        index: 4,
        number: 3,
        title: 'NFT Sale 3',
        timelineTitle: 'Whitelist Sale #3',
        isSoldOut: false,
        activeSoldOut: true,
        NFT_SALE_SC: configs.R34_NFT_SALE_SC,
        amount: 7981,
        bound: 300,
        fromTokenID: 2020,
        price: 159,
        mintPass: 1,
        nftPerPass: 1,
        description: 'Buy max 1 MoonBeast per MintPass',
        dateMsg: '12th October',
        eventUpdateSaleAmountName: 'R3UpdateSaleAmount',
        time: Date.now() + 30 * 24 * 60 * 60 * 1000,
        specialRound: false
    },
}

export const NFT_SALE_CURRENT_INFO = {
    ...NFT_SALE_ROUNDS_INFO.WC,
}

export const SUPPORTED_NETWORKS = [
    {
      name: "Moonbeam",
      short_name: "moonbeam",
      chain: "Moonbeam",
      network: "mainnet",
      chain_id: 1284,
      network_id: 1284,
      rpc_url: "https://rpc.api.moonbeam.network",
      native_currency: {
        symbol: "GLMR",
        name: "Glimmer",
        decimals: "18",
        contractAddress: "",
        balance: "",
      },
    },
    {
      name: "Moonriver",
      short_name: "moonriver",
      chain: "Moonriver",
      network: "mainnet",
      chain_id: 1285,
      network_id: 1285,
      rpc_url: "https://rpc.moonriver.moonbeam.network",
      native_currency: {
        symbol: "MOVR",
        name: "Moonriver",
        decimals: "18",
        contractAddress: "",
        balance: "",
      },
    },
    {
        name: "Moonbase Alpha",
        short_name: "moonbase",
        chain: "Moonbase",
        network: "testnet",
        chain_id: 1287,
        network_id: 1287,
        rpc_url: "https://rpc.api.moonbase.moonbeam.network",
        native_currency: {
            symbol: "DEV",
            name: "DEV",
            decimals: "18",
            contractAddress: "",
            balance: "",
        },
    },
];


export const getPersonalSignMessage = (message) => {
    return `0x${Buffer.from(message, 'utf8').toString('hex')}`
}