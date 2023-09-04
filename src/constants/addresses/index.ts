import MULTICALL_ABI from '../jsons/multicall.json'
import FACTORY_ABI from '../jsons/factory.json'
import ROUTER_ABI from '../jsons/router.json'
import { ChainId } from 'interfaces'

const MULTICALL_NETWORKS: { [chainId: number]: string } = {
    [ChainId.ZKMAINNET]: '0x35fC1821db864253E43f9611cc9d6fEFD3AAC00B',
    [ChainId.ZKTESTNET]: '0xb6d65a6e0AA575e2280427D58375Ee5cED42A764',
    [ChainId.GOERLI]: '0x77dca2c955b15e9de4dbbcf1246b4b85b651e50e',
    [ChainId.MUMBAI]: '0xB151dC6839fD13aefE69593FD12327d4F459E6eB',
}

const FACTORIES: { [chainId: number]: string } = {
    [ChainId.ZKMAINNET]: '0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f',
    [ChainId.ZKTESTNET]: '0xc1F7B91CeDd8308064ABAC2975BE33D7b51B7A26',
    [ChainId.GOERLI]: '0x216d07bD1C0F24740b8c88Ee9088b34FFae4b445',
    [ChainId.MUMBAI]: '0x0D6E4ed8C702c387E2B0735f39d895990e5963b7',
}

const ROUTERS: { [chainId: number]: string } = {
    [ChainId.ZKMAINNET]: '0x2da10A1e27bF85cEdD8FFb1AbBe97e53391C0295',
    [ChainId.ZKTESTNET]: '0xFa847ca3E26C614eC62583b50d2C68383E91a362', 
    [ChainId.GOERLI]: '0x78CFcb22e41dD58B92fF09bb54Ab1238c25ce0b1',
    [ChainId.MUMBAI]: '0xd6E887A268b0422851c10e88D7e1CaA5F03Ee2E2', 
}

const SYNCSWAP_ROUTERS: { [chainId: number]: string } = {
    [ChainId.ZKMAINNET]: '0x2da10A1e27bF85cEdD8FFb1AbBe97e53391C0295',
    [ChainId.ZKTESTNET]: '0xB3b7fCbb8Db37bC6f572634299A58f51622A847e', 
    [ChainId.GOERLI]: '0x78CFcb22e41dD58B92fF09bb54Ab1238c25ce0b1',
    [ChainId.MUMBAI]: '0xd6E887A268b0422851c10e88D7e1CaA5F03Ee2E2', 
}

const SYNCSWAP_FACTORIES: { [chainId: number]: string } = {
    [ChainId.ZKMAINNET]: '0xf2DAd89f2788a8CD54625C60b55cD3d2D0ACa7Cb',
    [ChainId.ZKTESTNET]: '0xf2FD2bc2fBC12842aAb6FbB8b1159a6a83E72006',
    [ChainId.GOERLI]: '0x216d07bD1C0F24740b8c88Ee9088b34FFae4b445',
    [ChainId.MUMBAI]: '0x0D6E4ed8C702c387E2B0735f39d895990e5963b7',
}


const FARMING_ADDRESSES: { [chainId: number]: string } = {
    [ChainId.ZKMAINNET]: '',
    [ChainId.ZKTESTNET]: '0xA7B7C444bFa89C0c42A60479029A359f2FAD1008', 
    [ChainId.GOERLI]: '',
    [ChainId.MUMBAI]: '', 
} 

const INIT_CODE_HASHES: { [chainId: number]: string } = {
    [ChainId.ZKMAINNET]:
        '0x96e8ac4277198ff8b6f785478aa9a39f403cb768dd02cbee326c3e7da348845f',
    [ChainId.ZKTESTNET]:
        '0xa6ef5b58f860b28d9a964786f253a12478da51b66550b2bf1561fbaf149301ae',
    [ChainId.GOERLI]:
        '0x96e8ac4277198ff8b6f785478aa9a39f403cb768dd02cbee326c3e7da348845f',
    [ChainId.MUMBAI]:
        '0x0c18c0437decb2e9aeb8498fc7fd556cac1a8baef62ab1920708dc852189c9d7',
}

export const WRAPPED_NATIVE_ADDRESSES: { [chainId: number]: string } = {
    [ChainId.ZKMAINNET]: '0x5aea5775959fbc2557cc8789bc1bf90a239d9a91',
    [ChainId.ZKTESTNET]: '0x20b28b1e4665fff290650586ad76e977eab90c5d',
    [ChainId.GOERLI]: '0xB4FBF271143F4FBf7B91A5ded31805e42b2208d6',
    [ChainId.MUMBAI]: '0x9c3C9283D3e44854697Cd22D3Faa240Cfb032889',
}

export {
    MULTICALL_ABI,
    MULTICALL_NETWORKS,
    FACTORIES,
    FACTORY_ABI,
    ROUTERS,
    ROUTER_ABI,
    INIT_CODE_HASHES,
    FARMING_ADDRESSES,
    SYNCSWAP_FACTORIES,
    SYNCSWAP_ROUTERS
}
