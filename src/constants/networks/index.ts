import LogoERA from 'assets/token-logos/era.svg'
import LogoMatic from 'assets/token-logos/matic.svg'
import LogoETH from 'assets/token-logos/eth.svg'
import LogoLinea from 'assets/token-logos/Linea.svg'
import LogoBase from 'assets/token-logos/base.svg'
import { Token, TokenList, ChainId } from 'interfaces/index'

export const ListNetwork = [
    {
        name: 'LINEA Testnet',
        chainId: 59140,
        logo: LogoLinea,
        switchNetwork: [
            {
                chainId: 59140,
                chainName: 'LINEA Testnet',
                nativeCurrency: {
                    name: 'ETH',
                    symbol: 'ETH',
                    decimals: 18,
                },
                rpcUrls: ['https://linea-goerli.infura.io/v3/'],
                blockExplorerUrls: ['https://goerli.lineascan.build/'],
            },
        ],
    },  
    {
        name: 'Base Testnet',
        chainId: 84531,
        logo: LogoBase,
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
        name: 'zkSync Testnet',
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
        name: 'Ethereum Testnet',
        chainId: 5,
        logo: LogoETH,
        switchNetwork: [
            {
                chainId: 5,
                chainName: 'Ethereum Testnet',
                nativeCurrency: {
                    name: 'ETH',
                    symbol: 'ETH',
                    decimals: 18,
                },
                rpcUrls: ['https://goerli.infura.io/v3/'],
                blockExplorerUrls: ['https://goerli.etherscan.io'],
            },
        ],
    },

]

export const InfoNetwork: {
    [chainId: number]: { name: string; logo: string }
} = {
    // [ChainId.ZKMAINNET]: {
    //     name: 'Mainnet',
    //     logo: LogoERA,
    // },
    [ChainId.LINEATESTNET]: {
        name: 'LINEA Testnet',
        logo: LogoLinea,
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
        logo: LogoBase,
    },
    // [ChainId.LINEATESTNET]: {
    //     name: 'LINEA Testnet',
    //     logo: LogoLinea,
    // },
}
