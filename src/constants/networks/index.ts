import LogoERA from 'assets/icons/era.svg'
import LogoMatic from 'assets/token-logos/matic.svg'
import LogoETH from 'assets/token-logos/eth.svg'
import { Token, TokenList, ChainId } from 'interfaces/index'

export const ListNetwork = [
    {
        name: 'Mainnet',
        chainId: 324,
        logo: LogoERA,
        switchNetwork: [
            {
                chainId: 324,
                chainName: 'ZkSync',
                nativeCurrency: {
                    name: 'ETH',
                    symbol: 'ETH',
                    decimals: 18,
                },
                rpcUrls: ['https://zksync2-mainnet.zksync.io'],
                blockExplorerUrls: ['https://explorer.zksync.io/'],
            },
        ],
    },
    {
        name: 'Testnet',
        chainId: 280,
        logo: LogoERA,
        switchNetwork: [
            {
                chainId: 280,
                chainName: 'ZkSync Testnet',
                nativeCurrency: {
                    name: 'ETH',
                    symbol: 'ETH',
                    decimals: 18,
                },
                rpcUrls: ['https://zksync2-testnet.zksync.dev'],
                blockExplorerUrls: ['https://zksync2-testnet.zkscan.io'],
            },
        ],
    },
    {
        name: 'Base Testnet',
        chainId: 84531,
        logo: LogoETH,
        switchNetwork: [
            {
                chainId: 84531,
                chainName: 'Base Testnet',
                nativeCurrency: {
                    name: 'ETH',
                    symbol: 'ETH',
                    decimals: 18,
                },
                rpcUrls: ['https://base-goerli.public.blastapi.io'],
                blockExplorerUrls: ['https://goerli.base.org'],
            },
        ],
    },
    {
        name: 'LINEA Testnet',
        chainId: 59140,
        logo: LogoETH,
        switchNetwork: [
            {
                chainId: 59140,
                chainName: 'LINEA Testnet',
                nativeCurrency: {
                    name: 'ETH',
                    symbol: 'ETH',
                    decimals: 18,
                },
                rpcUrls: ['https://base-goerli.public.blastapi.io'],
                blockExplorerUrls: ['https://goerli.base.org'],
            },
        ],
    },
]

export const InfoNetwork: {
    [chainId: number]: { name: string; logo: string }
} = {
    [ChainId.ZKMAINNET]: {
        name: 'Mainnet',
        logo: LogoERA,
    },
    [ChainId.ZKTESTNET]: {
        name: 'Testnet',
        logo: LogoERA,
    },
    [ChainId.MUMBAI]: {
        name: 'Mumbai',
        logo: LogoMatic,
    },
    [ChainId.GOERLI]: {
        name: 'Goerli',
        logo: LogoETH,
    },
    [ChainId.BASETESTNET]: {
        name: 'Base Testnet',
        logo: LogoETH,
    },
    [ChainId.LINEATESTNET]: {
        name: 'LINEA Testnet',
        logo: LogoETH,
    },
}